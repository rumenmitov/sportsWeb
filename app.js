// Packages
const fs = require("fs"),
  https = require("https"),
  express = require("express"),
  bodyParser = require("body-parser"),
  cors = require('cors');
  nodemailer = require("nodemailer"),
  mongo = require("mongodb"),
  MongoClient = mongo.MongoClient;

// SSL Certificate wil remian only on the server
const sslOptions = {
  key: fs.readFileSync("./key.pem"),
  cert: fs.readFileSync("./cert.pem"),
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
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(
      'School email not recognised. Please try again. <button onclick="location.href=`https://sportspc.ml/signup/verification.html`;">Try Again</button>'
    );
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
              res.send(
                "This email is already in use. Please check your inbox for more information"
              );
            }
          );
        } else {
          // If not, send verification email
          if (recipient) {
            nodeTransporter.sendMail(
              {
                from: credentials.user,
                to: recipient,
                subject: "Email Verification",
                html: `<p>Click below to sign-up!</p><br><a href='https://sportspc.ml/signup/signup.html?email=${recipient}'>Verify</a>`,
              },
              (err) => {
                if (err) console.log(err);
                res.send("Verification email sent. Please check your inbox");
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
                res.send(
                  "This email is already in use. Please check your inbox for more information"
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

              nodeTransporter.sendMail(
                {
                  from: credentials.user,
                  to: recipient,
                  subject: "Thank you for signing-up!",
                  html: `<a href='https://sportspc.ml/'>Back to site</a>`,
                },
                (err) => {
                  if (err) console.log(err);
                  res.send(
                    "Good to go. Please check your inbox for more information"
                  );
                }
              );

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

                      console.log("Participant added to team.");
                      client.close();
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

                    console.log("New team created.");
                    console.log("Participant added to team.");
                    client.close();
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
router.route("/:id").delete((req, res, next) => {
  // This is to delete entries in the table
  let requestID = JSON.parse(req.params["id"])["id"];
  let requestTeam = JSON.parse(req.params["id"])["team"];
  let requestEmail = JSON.parse(req.params["id"])["email"];

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
        res.end(`Participant with ID: ${requestID} deleted successfully!`);
        client.close();
      });
    });
  }
});

// Finally, launching the server at port 5454
let app = express().use("/signup", router);

https.createServer(sslOptions, app).listen(5454);

console.log("listening on port 5454");
