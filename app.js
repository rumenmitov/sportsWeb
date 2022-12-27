// Packages
const fs = require("fs"),
  https = require("https"),
  express = require("express"),
  bodyParser = require("body-parser"),
  cors = require("cors"),
  nodemailer = require("nodemailer"),
  mongo = require("mongodb"),
  MongoClient = mongo.MongoClient;

// SSL certificate is kept only at the server
const sslOptions = {
  key: fs.readFileSync("../sslCertificate/key.pem"),
  cert: fs.readFileSync("../sslCertificate/cert.pem"),
};

// URL for MongoDB Atlas
const AtlasUrl =
  "mongodb+srv://pc:R9wlrSS7hDEmhbSx@sportswebsite.pypjb10.mongodb.net/?retryWrites=true&w=majority";

// Credentials for PC email and the email setup
const credentials = {
  user: "sports.pclux1@gmail.com",
  pass: "kneklawtmqepycpp",
};

let nodeTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: credentials,
});

// Router for signup
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.route("/verify").post((req, res, next) => {
  let recipient = req.body.email;

  if (recipient.split("@")[1] !== "student.eursc.eu") {
    res.sendFile(__dirname + "/server/responsePages/invalidEmail.html");
  } else {
    let client = new MongoClient(AtlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) console.log(err);

      let db = client.db("basketballTournament").collection("participants");

      // Check if participant is already signed up
      db.find({ email: req.body.email }).toArray((err, results) => {
        if (err) console.log(err);

        let recipient = req.body.email;
        if (results[0]) {
          // If this is true that means email is already registered, so send email to tell user that the email is already in use
          nodeTransporter.sendMail(
            {
              from: credentials.user,
              to: recipient,
              subject: "Email Already in Use",
              html: `<p>Your email has already been used!</p><br><a href='https://sportspc.ml/'>Back to site</a>`,
            },
            (err) => {
              if (err) console.log(err);
              res.sendFile(
                __dirname + "/server/responsePages/emailAlreadyInUse.html"
              );
            }
          );
        } else {
          // If not, send verification email
          if (recipient) {
            // Before sending the email we have to decrypt the user's email which they will use later to sign-up
            let encodedEmail = Buffer.from(recipient, 'base64');
            nodeTransporter.sendMail(
              {
                from: credentials.user,
                to: recipient,
                subject: "Email Verification",
                html: `<p>Click below to sign-up!</p><br><a href='https://sportspc.ml/signup/signup.html?userCode=${encodedEmail}'>Verify</a>`,
              },
              (err) => {
                if (err) console.log(err);
                res.sendFile(
                  __dirname + "/server/responsePages/verificationEmailSent.html"
                );
              }
            );
          }
        }
      });
    });
  }
});

// This part of the router is responsible for the GET and POST (for seeing all data and adding new participants)
router
  .route("/")
  .get((req, res, next) => {
    // This is for searching the databse
    let client = new MongoClient(AtlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) console.log(err);

      let db = client.db("basketballTournament").collection("participants");

      db.find().toArray((err, results) => {
        if (err) console.log(err);
        res.send(results);
      });
    });
  })
  .post((req, res, next) => {
    // This is for adding to the database
    if (req.body) {
      let client = new MongoClient(AtlasUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      client.connect((err) => {
        if (err) console.log(err);

        let db = client.db("basketballTournament").collection("participants");
        let dbTeams = client.db("basketballTournament").collection("teams");

        // Check if participant is already signed up
        db.find({ email: req.body.email }).toArray((err, results) => {
          if (err) console.log(err);

          let recipient = req.body.email;
          if (results[0]) {
            // If this is true that means email is already registered, so send email to tell user that the email is already in use

            nodeTransporter.sendMail(
              {
                from: credentials.user,
                to: recipient,
                subject: "Email Already in Use",
                html: `<p>Your email has already been used!</p><br><a href='https://sportspc.ml/'>Back to site</a>`,
              },
              (err) => {
                if (err) console.log(err);
                res.sendFile(
                  __dirname + "/server/responsePages/emailAlreadyInUse.html"
                );
                return next();
              }
            );
          } else {
            let newParticipant = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              dob: req.body.dob,
              class: req.body.class,
              email: req.body.email,
            };
            if (req.body.team === "newTeam")
              newParticipant.team = req.body.newTeam;
            else newParticipant.team = req.body.team;

            db.insertOne(newParticipant, (err, docs) => {
              if (err) console.log(err);
              console.log("New person added.");
            });

            dbTeams
              .find({ team: newParticipant.team })
              .toArray((err, results) => {
                if (err) console.log(err);

                if (results[0]) {
                  // Add participant to team in Teams collection (if team already exists)
                  dbTeams.updateOne(
                    { team: newParticipant.team },
                    { $push: { teamMembers: newParticipant } },
                    (err) => {
                      if (err) console.log(err);

                      let listOfTeammates = "";
                      for (let index in results[0].teamMembers) {
                        if (index == 0) {
                          listOfTeammates = `${results[0].teamMembers[index].firstName} ${results[0].teamMembers[index].lastName}`;
                        } else {
                          listOfTeammates += `, ${results[0].teamMembers[index].firstName} ${results[0].teamMembers[index].lastName}`;
                        }
                      }

                      nodeTransporter.sendMail(
                        {
                          from: credentials.user,
                          to: recipient,
                          subject: "Thank you for signing-up!",
                          html: `<h1>Here is your info:</h1>
                          <p><b>First Name:</b> ${newParticipant.firstName}</p>
                          <p><b>Last Name:</b> ${newParticipant.lastName}</p>
                          <p><b>Date of Birth:</b> ${newParticipant.dob}</p>
                          <p><b>Class:</b> ${newParticipant.class}</p>
                          <p><b>Team:</b> ${newParticipant.team}</p>
                          <hr>
                          <h2>Your teammates are:</h2>
                          <p>${listOfTeammates}</p>
                          <a href='https://sportspc.ml/'>Back to site</a>`,
                        },
                        (err) => {
                          if (err) console.log(err);
                          console.log("Participant added to team.");
                        }
                      );

                      // sending an email to notify the other members of the team
                      let listOfTeamEmails = [];
                      for (let index in results[0].teamMembers) {
                        listOfTeamEmails.push(
                          results[0].teamMembers[index].email
                        );
                      }
                      nodeTransporter.sendMail(
                        {
                          from: credentials.user,
                          to: listOfTeamEmails,
                          subject: "New Member was Added to Your Team",
                          html: `<h1>Here is their info:</h1>
                          <p><b>First Name:</b> ${newParticipant.firstName}</p>
                          <p><b>Last Name:</b> ${newParticipant.lastName}</p>
                          <p><b>Date of Birth:</b> ${newParticipant.dob}</p>
                          <p><b>Class:</b> ${newParticipant.class}</p>
                          <p><b>Team:</b> ${newParticipant.team}</p>
                          <a href='https://sportspc.ml/'>Back to site</a>`,
                        },
                        (err) => {
                          if (err) console.log(err);
                          console.log("Team has been notified");
                          res.sendFile(
                            __dirname +
                              "/server/responsePages/userSignedUp.html"
                          );
                          client.close();
                        }
                      );
                    }
                  );
                } else {
                  // Create new team and add player
                  let newTeamObj = {
                    team: newParticipant.team,
                    teamMembers: [newParticipant],
                  };

                  dbTeams.insertOne(newTeamObj, (err, docs) => {
                    if (err) console.log(err);

                    nodeTransporter.sendMail(
                      {
                        from: credentials.user,
                        to: recipient,
                        subject: "Thank you for signing-up!",
                        html: `<h1>Here is your info:</h1>
                        <p><b>First Name:</b> ${newParticipant.firstName}</p>
                        <p><b>Last Name:</b> ${newParticipant.lastName}</p>
                        <p><b>Date of Birth:</b> ${newParticipant.dob}</p>
                        <p><b>Class:</b> ${newParticipant.class}</p>
                        <p><b>Team:</b> ${newParticipant.team}</p>
                        <hr>
                        <p>You do not have any teammates yet. You will be notified if other players join your team.</p>
                        <a href='https://sportspc.ml/'>Back to site</a>`,
                      },
                      (err) => {
                        if (err) console.log(err);
                        res.sendFile(
                          __dirname + "/server/responsePages/userSignedUp.html"
                        );
                        console.log("New team created.");
                        console.log("Participant added to team.");
                        client.close();
                      }
                    );
                  });
                }
              });
          }
        });
      });
    }
  });

// This part of the router is responsible for handling the teams
router.route("/teams").get((req, res) => {
  let client = new MongoClient(AtlasUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err) => {
    if (err) console.log(err);

    let db = client.db("basketballTournament").collection("teams");

    db.find().toArray((err, results) => {
      if (err) console.log(err);

      res.send(results);
    });
  });
});

// This part of the router is responsible for DELETE (because I need to find parameters to pass data to server)
router.route("/:userInfo").delete((req, res, next) => {
  // This is to delete entries in the table
  let requestID = JSON.parse(req.params["userInfo"])["id"];
  let requestTeam = JSON.parse(req.params["userInfo"])["team"];
  let requestEmail = JSON.parse(req.params["userInfo"])["email"];

  if (requestID) {
    // Deleting users by ID (to prevent deletion of the wrong participant by accident)
    let findKeyID = { _id: mongo.ObjectId(requestID) };
    let findKeyTeam = { team: requestTeam };
    let findKeyEmail = { email: requestEmail };

    // First delete participant from team
    let teamClient = new MongoClient(AtlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    teamClient.connect((err) => {
      if (err) console.log(err);

      let db = teamClient.db("basketballTournament").collection("teams");
      // Find the right team
      db.find(findKeyTeam).toArray((err, results) => {
        if (err) console.log(err);

        // We get an array back which contains the team that we want
        for (let index in results[0].teamMembers) {
          console.log(index);
          // Find the right participant and remove them from the team
          if (results[0].teamMembers[index].email === requestEmail) {
            results[0].teamMembers.splice(index, 1);

            db.deleteOne(findKeyTeam, (err, docs) => {
              if (err) console.log(err);

              // Now add the team to the collection again
              db.insertOne(results[0], (err, docs) => {
                if (err) console.log(err);
                console.log("Object added again");
                teamClient.close();
              });
            });
            return;
          }
        }
      });
    });

    // Then delete participant
    let client = new MongoClient(AtlasUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect((err) => {
      if (err) console.log(err);

      let db = client.db("basketballTournament").collection("participants");
      db.deleteOne(findKeyID, (err, docs) => {
        if (err) console.log(err);

        console.log("Participant deleted.");
        res.send(`<p>Participant with email: <b>${requestEmail}</b> deleted successfully!`);
        client.close();
      });
    });
  }
});

// Finally, launching the server at port 5454
let app = express().use(cors()).use("/signup", router);
https.createServer(sslOptions, app).listen(5454);

console.log("listening on port 5454");
