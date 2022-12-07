const express = require('express'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient;

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.route('/')
    .post((req, res, next)=>{
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
    });

let app = express()
    .use('/signup', router)
    .use((req, res)=>{
        res.send('thank you for your response');
    })
    .listen(5454);

    console.log('listening on port 5454');
