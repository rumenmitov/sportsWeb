// Packages
const express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient;

// Router for signup
let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.route('/')
    .get((req, res, next)=>{
        // This is for searching the databse
        MongoClient.connect('mongodb://127.0.0.1:27017/', (err, client)=>{
          if (err) console.log(err);

          let db =  client.db('basketballTournament').collection('participants')
          
          db.find().toArray((err, results)=>{
            if (err) console.log(err);
            console.log(results);
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

                    console.log('new person added');
                    client.close();
                });
            });
            next();
        }
    })
    .delete((req, res, next)=>{
        // This is to delete entries in the table
        if (req.body) {
            MongoClient.connect('mongodb://127.0.0.1:27017', (err, client)=>{
                if (err) console.log(err);

                let db = client.db('basketballTournament').collection('participants');
                db.deleteOne(req.body, (err, docs)=>{
                    if (err) console.log(err);

                    res.end('Participant deleted successfully!');
                    client.close();
                })
            })
        }
    })

// Finally, launching the server at port 5454
let app = express()
    .use('/signup', router)
    .use((req, res)=>{
        res.send('thank you for your response');
    })
    .listen(5454);

    console.log('listening on port 5454');
