const fs = require("fs"),
  http = require("http"),
  https = require("https"),
  express = require("express");

// SSL certificate is kept only at the server
const sslOptions = {
  key: fs.readFileSync("../sslCertificate/key.pem"),
  cert: fs.readFileSync("../sslCertificate/cert.pem"),
};

// Credentials for admin portal
const credentials = {
  user: "pc",
  pass: "PC@lux1",
};

function auth(req, res, next) {
  function send401() {
    res.writeHead(401, { "WWW-Authenticate": "Basic" });
    res.end();
  }

  let authHeader = req.headers.authorization;

  if (!authHeader) {
    send401();
    return;
  }

  let auth = new Buffer(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");
  let user = auth[0];
  let pass = auth[1];

  if (user == credentials.user && pass == credentials.pass) {
    next(); // all good
  } else send401();
}

let app = express()
  // Login to admin portal
  .use("/admin", auth)
  .use("/admin", express.static(__dirname + "/admin", { index: "admin.html" }))
  // Normal website
  .use(express.static(__dirname + "/public"));

https.createServer(sslOptions, app).listen(443);

// Redirecting HTTP trffic
http
  .createServer((req, res) => {
    res.writeHead(301, { Location: "https://sportspc.ml" });
    res.end();
  })
  .listen(80);

console.log("listening on port 443 and 80");
