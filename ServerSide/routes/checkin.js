var admin = require("firebase-admin");
var db = admin.database();
var userRef = db.ref("/credentital/user");
var companyRef = db.ref("/credentital/company");
var userCheckinRef = db.ref("checkIn/userCheckList");
var companyCheckinRef = db.ref("checkIn/companyCheckList");
const domainName = "https://stark-garden-51779.herokuapp.com";

var checkin = {
    checkin: function(req, res) {
        var date = new Date();
        var currentDate = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear();
        console.log("checkin.checkin");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var token = req.body.access_token || '';
        var wifiMacId = req.body.macid || '';
        var company = req.body.company || '';

        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        if (wifiMacId == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid place'
            });
            return;
        }

        //check if user have checked in yet
        userCheckinRef.child('/' + userid + '/' + currentDate + '/checkInTime').once('value', (snapshot) => {
            //have checked in yet
            if (snapshot.val() != null) {
                res.status(200);
                res.json({
                    'code': 2,
                    'message': 'User have already checked in',
                    'checkInTime': snapshot.val(),
                    'today': currentDate
                });
                return;
            } else {
                //check if user belong company
                userRef.child("/" + userid + '/company/' + company).once('value', (snapshot) => {
                    if (snapshot.val() == null) {
                        res.status(200);
                        res.json({
                            'code': 3,
                            'message': 'User does not belong company'
                        });
                        return;
                    }

                    //check if user using company's wifi to check in
                    companyRef.child("/" + company + '/wifiInfo/macid').once('value', (snapshot) => {
                        console.log("Wifi info: ", snapshot.val());
                        console.log("macid", snapshot.val().wifiMacId)
                        if (snapshot.val()[wifiMacId] == null || snapshot.val()[wifiMacId] == undefined) {
                            res.status(200);
                            res.json({
                                'code': 4,
                                'message': 'Invalid macid',
                                'validWifi': snapshot.val()[Object.keys(snapshot.val())[0]]
                            });
                            return;
                        }
                        //check in
                        let nowTime = date.getTime();
                        let isOntime = false;
                        if (date.getHours * 60 + date.getMinutes * 60 <= (8 * 60 + 30)) isOntime = true;
                        userCheckinRef.child(userid + '/' + currentDate).set({
                            'checkInPlace': company,
                            'checkInTime': nowTime,
                            'checkOutTime': 0,
                            'isOntime': isOntime
                        });
                        res.status(200);
                        res.json({
                            'code': 1,
                            'message': 'Checked in successfully',
                            'checkInTime': nowTime,
                            'today': currentDate
                        });
                        return;
                    })

                })
            }
        })
    },

    getCheckinInfo: function(req, res) {
        console.log("checkin.getCheckinStatus");
        var username = req.headers.username || '';
        var userid = req.headers.userid || '';
        var token = req.headers.access_token || '';
        var date = req.headers.check_date || '';
        var company = req.headers.company || '';
        console.log("header", req.headers);
        console.log("body", req.body);
        if (username == '' || token == '' || userid == '') {
            res.status(400);
            res.json({
                'status': 400,
                'message': 'Missing credentitals'
            });
            return;
        }

        if (date == '') {
            res.status(400);
            res.json({
                'status': 400,
                'message': 'Missing date'
            });
            return;
        }

        //get checkin status
        userCheckinRef.child('/' + userid + '/' + date).once('value', (checkinData) => {
            //have checked in yet
            if (checkinData.val() != null) {
                console.log(checkinData.val());
                res.status(200);
                res.json(
                    checkinData.val()
                );
                return;
            } else {
                //check if user belong company
                userRef.child("/" + userid + '/company/' + company).once('value', (companyData) => {
                    if (companyData.val() == null) {
                        res.status(200);
                        res.json({
                            'code': 1,
                            'message': 'User does not belong company'
                        });
                        return;
                    } else {
                        res.status(200);
                        res.json({
                            'code': 1,
                            'message': 'Data not found'
                        })
                    }
                })

            }
        })
    },

    checkout: function(req, res) {
        var date = new Date();
        var currentDate = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear();
        console.log("checkin.checkout");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var token = req.body.access_token || '';
        var wifiMacId = req.body.macid || '';
        var company = req.body.company || '';

        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        if (wifiMacId == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid place'
            });
            return;
        }

        //check if user have checked in yet
        userCheckinRef.child('/' + userid + '/' + currentDate + '/checkInTime').once('value', (snapshot) => {
            //have not yet checked in yet
            if (snapshot.val() == null || snapshot.val() == 0) {
                res.status(200);
                res.json({
                    'code': 2,
                    'message': 'User have NOT checked in yet'
                });
                return;
            } else {
                //check if user have checked out yet
                userCheckinRef.child('/' + userid + '/' + currentDate + '/checkOutTime').once('value', (snapshot) => {
                    //user have already checked out
                    if (snapshot.val() != null && snapshot.val() != 0) {
                        res.status(200);
                        res.json({
                            'code': 1,
                            'message': 'User have already checked out',
                            'checkoutTime': snapshot.val()
                        });
                        return;

                    } else {
                        //user have not checked out yet
                        //check if user belong company
                        userRef.child("/" + userid + '/company/' + company).once('value', (snapshot) => {
                            if (snapshot.val() == null) {
                                res.status(200);
                                res.json({
                                    'code': 2,
                                    'message': 'User does not belong company'
                                });
                                return;
                            }

                            //check if user using company's wifi to check in
                            companyRef.child("/" + company + '/wifiInfo/macid/' + wifiMacId).once('value', (snapshot) => {
                                if (snapshot.val() == null) {
                                    res.status(200);
                                    res.json({
                                        'code': 3,
                                        'message': 'Invalid macid'
                                    });
                                    return;
                                }
                                //check out
                                let checkoutTime = date.getTime();
                                userCheckinRef.child(userid + '/' + currentDate).update({
                                    'checkOutTime': checkoutTime
                                });
                                res.status(200);
                                res.json({
                                    'code': 1,
                                    'message': 'Checked out successfully',
                                    'checkoutTime': checkoutTime
                                });
                                return;
                            })
                        })
                    }
                })
            }
        })
    },

    history: function(req, res) {
        console.log("checkin.history");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var token = req.body.access_token || '';
        var startTime = req.body.start_time || '';
        var endTime = req.body.end_time || '';
        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        if (startTime == '' || endTime == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Missing time range'
            });
            return;
        }
        //Get 90 first records
        userCheckinRef.child('/' + userid).orderByChild('checkInTime').startAt(+startTime).endAt(+endTime).limitToLast(90).once('value', (snapshot) => {
            res.status(200);
            res.json(snapshot.val());
            return;
        })

    },

    adminHistory: function(req, res) {
        console.log("checkin.adminhistory");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var company = req.body.company;
        var targetUser = req.body.target_user;
        var token = req.body.access_token || '';
        var startTime = req.body.start_time || '';
        var endTime = req.body.end_time || '';
        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        if (startTime == '' || endTime == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Missing time range'
            });
            return;
        }

        companyRef.child('/' + company).once('value', (snapShot) => {
            var companyInfo = snapShot.val();
            if (company == null) {
                res.status(404);
                res.json({
                    "status": 404,
                    "message": "Company not found"
                });
                return;
            } else {
                //Check admin role
                if (companyInfo.founder != userid && companyInfo.manager != userid) {
                    res.status(403);
                    res.json({
                        "status": 403,
                        "message": "User does not have permition to read data"
                    });
                    return;
                } else {
                    //Get target userid
                    userRef.orderByChild("email").equalTo(targetUser).once("value", (snapShot) => {
                        if (snapShot.val() == null) {
                            res.status(404);
                            res.json({
                                "status": 404,
                                "message": "Target user not found"
                            });
                            return;
                        } else {
                            // Check target user and admin is same company
                            var targetUserId = Object.keys(snapShot.val())[0];
                            if (companyInfo.member[targetUserId] == null) {
                                res.status(403);
                                res.json({
                                    "status": 403,
                                    "message": "Target user does not belong your company"
                                });
                                return;
                            }
                            //Get data
                            userCheckinRef.child('/' + targetUserId).orderByChild('checkInTime').startAt(+startTime).endAt(+endTime).limitToLast(90).once('value', (snapshot) => {
                                res.status(200);
                                res.json(snapshot.val());
                                return;
                            });
                        }
                    });

                }
            }
        });

    }
}

module.exports = checkin;