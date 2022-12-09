// Packages
const express = require('express'),
    bodyParser = require('body-parser'),
    mongo = require('mongodb'),
    MongoClient = mongo.MongoClient;

// Router for signup
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// This part of the router is responsible for the GET and POST
router.route('/')
    .get((req, res, next)=>{
        // This is for searching the databse
        MongoClient.connect('mongodb://127.0.0.1:27017/', (err, client)=>{
          if (err) console.log(err);

          let db =  client.db('basketballTournament').collection('participants')
          
          db.find().toArray((err, results)=>{
            if (err) console.log(err);
            res.send(results)
          });
        });
    })
    .post((req, res, next)=>{
        // This is for adding to the database
        if (req.body) {
            MongoClient.connect('mongodb://127.0.0.1:27017/', (err, client)=>{
                if (err) console.log(err);

                let db = client.db('basketballTournament').collection('participants');
                db.insert(req.body, (err, docs)=>{
                    if (err) console.log(err);

                    console.log('New person added.');
                    client.close();
                });
            });
            next();
        }
    })

// This part of the router is responsible for DELETE (because I need to find parameters to pass data to server)
router.route('/:id')
    .delete((req, res, next)=>{
        // This is to delete entries in the table
        let requestID = req.params['id'];

        if (requestID) {
            // Deleting users by ID (to prevent deletion of the wrong participant by accident)
            let findKey = {"_id": mongo.ObjectId(requestID) };
            MongoClient.connect('mongodb://127.0.0.1:27017', (err, client)=>{
                if (err) console.log(err);

                let db = client.db('basketballTournament').collection('participants');
                db.deleteOne(findKey, (err, docs)=>{
                    if (err) console.log(err);

                    console.log('Participant deleted!');
                    res.end(`Participant with ID: ${requestID} deleted successfully!`);
                    client.close();
                });
            });
        }
    });

// Finally, launching the server at port 5454
let app = express()
    .use('/signup', router)
    .use((req, res)=>{
        res.send(`Thank you for your response!<br><button onclick='location.href="http://127.0.0.1:3000/signup/signup.html";'>Go back</button>`);
    })
    .listen(5454);

    console.log('listening on port 5454');
