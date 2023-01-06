const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

// SSL certificate is kept only at the server
const sslOptions = {
    key: fs.readFileSync("../sslCertificate/key.pem"),
    cert: fs.readFileSync("../sslCertificate/cert.pem"),
  };

let app = express()
.use(cors())
.use(bodyParser())
.get('/', (req, res)=>{
    let factsFile = fs.readFileSync(__dirname + '/facts.txt', 'utf-8');
    factsArray = factsFile.split('\r\n');

    res.json(factsArray);
    res.end();
});

https.createServer(sslOptions, app).listen(6969);
console.log('listening on port 6969');