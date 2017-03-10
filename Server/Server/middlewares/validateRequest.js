var jwt = require('jwt-simple');
var validateUser = require('../routes/auth').validateUser;

var apiPath = "/api/v1/";

module.exports = function(req, res, next) {
    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe. 

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['access_token'];
    var username = (req.body && req.body.username) || (req.query && req.query.username) || req.headers['username'];

    if (token || username) {
        try {
            var decoded = jwt.decode(token, username + require('../config/secret.js')());

            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    'status': 400,
                    'message': "Token expried"
                })
            } else {
                next();
            }

        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops something went wrong! Invalid Token or Key",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or Key"
        });
        return;
    }
}