var jwt = require('jwt-simple');
var SHA256 = require("crypto-js/sha256");
var admin = require("firebase-admin");
var db = admin.database();
var userRef = db.ref("/credentital/user");

const domainName = "https://stark-garden-51779.herokuapp.com";
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'xuanduanbk@gmail.com',
        pass: 'xdpro21021994'
    }
});

var auth = {
    login: function(req, res) {
        console.log("auth.login");
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        //Check credentital in database
        userRef.orderByChild("email").equalTo(username).once("value", (snapShot) => {

            if (snapShot.val() == null) {
                res.json({
                    'status': 401,
                    'message': 'Invalid credentitals'
                });
                return;
            } else {
                var userId = Object.keys(snapShot.val())[0];
                if (snapShot.val()[userId].password != password) {
                    res.json({
                        'status': 401,
                        'message': 'Invalid credentitals'
                    });
                    return;
                } else {
                    userRef.child(Object.keys(snapShot.val())[0]).update({
                        'isOnline': true
                    });
                    res.status(200);
                    res.json(getToken(snapShot.val()[userId]));
                    return;
                }
            }
        });
    },

    logout: function(req, res) {
        console.log("auth.logout");
        var username = req.body.username || '';
        var token = req.body.access_token || '';

        if (username == '' || token == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        //Check credentital in database
        userRef.orderByChild("email").equalTo(username).once("value", (snapShot) => {
            if (snapShot.val() == null) {
                res.json({
                    'status': 401,
                    'message': 'Invalid credentitals'
                });
                return;
            } else {
                var userId = Object.keys(snapShot.val())[0];
                userRef.child(userId).update({
                    "isOnline": false
                });
                res.status(200);
                res.json({
                    "status": "200",
                    "message": "Logged out!"
                });
                return;
            }
        });
    },

    register: function(req, res) {
        console.log('auth.register');

        var email = req.body.email || '';
        var password = req.body.password || '';
        var fullname = req.body.fullname || '';
        var type = req.body.type || '1'; //1 = check email; != register

        //check email null
        if (email.trim() == '') {
            res.status(406);
            res.json({
                'status': 406,
                'message': 'Email can not be null!'
            });
            return;
        }

        //check valid email
        if (!validateEmail(email)) {
            res.status(406);
            res.json({
                'status': 406,
                'message': 'Invalid email!'
            });
            return;
        }

        //Check unique email         
        userRef.orderByChild("email").equalTo(email).once("value", (snapShot) => {
            if (snapShot.val() != null) {
                res.status(409);
                res.json({
                    'status': 409,
                    'message': 'Email have already existed!'
                });
                return;
            } else {
                if (type == 1) { //check email only
                    res.status(200);
                    res.json({
                        'status': 200,
                        'message': 'Email can be used!'
                    });
                    return;
                } else { //request for register
                    if (password.trim().length < 6) {
                        res.status(406);
                        res.json({
                            'status': 406,
                            'message': 'Password must be have at least 6 characters!'
                        });
                        return;
                    } else {
                        //well, password and email all are fine.
                        //create active code
                        var activeCode = SHA256(email + Math.random() * 1000);
                        // Store to firebase 
                        var userObject = {
                            "email": email,
                            "password": password,
                            "fullName": fullname,
                            "activeCode": activeCode,
                            "isActive": false,
                            "isOnline": false
                        }
                        userRef.push(userObject);

                        //Send email
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: 'Team Check-in App', // sender address
                            to: email, // list of receivers
                            subject: 'Confirm registation at Team Check-in App ', // Subject line
                            text: '', // plain text body
                            html: '<p>Hi,</p>' +
                                '<p>You or some one have just registered this email in Team Check-in App. If it is you, please follow the link below to active your account. </p>' +
                                '<p>' + domainName + '/register/confirm/' + email + '/' + activeCode.words.join('') + '</p><br><br/>' +
                                '<p>Regards</p><p>Team Check-in App</p>' // html body
                        };

                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('Message %s sent: %s', info.messageId, info.response);
                        });

                        //response
                        res.status(200);
                        res.json({
                            'status': 200,
                            'message': 'Register successfully. Please check the email to active the credentital!'
                        });
                        return;
                    }
                }
            }
        });
    },

    confirmEmail: function(req, res) {
        var email = req.params.email || '';
        var code = req.params.code || '';
        if (email.trim() == '' || code.trim() == '') {
            res.send('Invalid active code. Please, re-register to receive other code!');
        } else {
            userRef.orderByChild("email").equalTo(email).once("value", (snapShot) => {
                console.log('check: ', snapShot.val())
                if (snapShot.val() == null || snapShot.val()[Object.keys(snapShot.val())[0]].activeCode.words.join('') != code) {
                    res.send('Invalid active code. Please, re-register to receive other code!');
                } else {
                    userRef.child(Object.keys(snapShot.val())[0]).update({
                        'isActive': true
                    });
                    res.send("You have successfully confirmed your account. Login your app and enjoy!");
                }
            })
        }
    }
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function getToken(user) {
    var expires = expiresIn(7); //7 days
    var token = jwt.encode({
        exp: expires
    }, user.email + require('../config/secret')());
    return {
        token: token,
        expires: expires,
        email: user.email
    }
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;