var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();
var apiPath = "/api/v1/";
app.use(logger('dev'));
app.use(bodyParser.json());

var admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert("./team-check-in-app-firebase-adminsdk-1x5dm-52fff64156.json"),
    databaseURL: "https://team-check-in-app.firebaseio.com"
});

app.all('/*', (req, res, next) => {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // Set custom headers for CORS
    res.header("Access-Control-Allow-Headers", "Content-type, Acept, X-Access-Token, X-Key, username, userid, access_token,company,check_date");
    if (req.method == "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you 
// are sure that authentication is not needed
app.all(apiPath + '*', [require('./middlewares/validateRequest')]);
app.use('/', require('./routes'));

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});
// app.get('/', (request, response) => {
//     response.send("Hello. This is Team Check-in App!");
// })
var server = app.listen(process.env.PORT || 8081, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log("App running at %s:%s", host, port);
})