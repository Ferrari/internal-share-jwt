var http = require('http');
var express = require('express');
var cors = require('cors');
var app = express();
var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// Set up our JWT authentication middleware
// Be sure to replace the YOUR_AUTH0_CLIENT_SECRET and
// YOUR_AUTHO_CLIENT_ID with your apps credentials which
// can be found in your management dashboard at 
// https://manage.auth0.com
var SERVER_SECRET = "jwt-example-secret";
var JWT_AUDIENCE = "jwt-client";
var authenticate = expressjwt({
  secret: new Buffer(SERVER_SECRET, 'base64'),
  audience: JWT_AUDIENCE
});

app.use(cors());

app.get('/token', function(req, res) {
	return res.send(jwt.sign(
    { sub : "1234567890", name : "Ado Kukic", admin: true }, 
    new Buffer(SERVER_SECRET, 'base64'),
    { "audience": JWT_AUDIENCE }
  ));
});

// Here we have a public route that anyone can access
app.get('/ping', function(req, res) {
  res.send(200, {text: "All good. You don't need to be authenticated to call this"});
});

// We include the authenticate middleware here that will check for
// a JWT and validate it. If there is a token and it is valid the
// rest of the code will execute.
app.get('/secured/ping', authenticate, function(req, res) {
  res.send(200, {text: "All good. You only get this message if you're authenticated"});
})

var port = process.env.PORT || 3001;

// We launch our server on port 3001.
http.createServer(app).listen(port, function (err) {
  console.log('listening in http://localhost:' + port);
});
