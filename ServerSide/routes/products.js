var admin = require("firebase-admin");
var db = admin.database();
// var userRef = db.ref("/credentital/user");
var companyRef = db.ref("/credentital/company");
// var userCheckinRef = db.ref("checkIn/userCheckList");
// var companyCheckinRef = db.ref("checkIn/companyCheckList");
// var foodRef = db.ref("production/food");
// var drinkRef = db.ref("production/drink");
var productRef = db.ref("production");
var orderRef = db.ref("order");
const domainName = "https://stark-garden-51779.herokuapp.com";

var product = {
    // getFood: function(req, res) {
    //     console.log("product.getFood");
    //     var username = req.body.username || '';
    //     var userid = req.body.userid || '';
    //     var token = req.body.access_token || '';
    //     var company = req.body.company;

    //     if (username == '' || token == '' || userid == '') {
    //         res.status(401);
    //         res.json({
    //             'status': 401,
    //             'message': 'Invalid credentitals'
    //         });
    //         return;
    //     }
    //     //Check if user belong company or not
    //     companyRef.child('/' + company + "/member/" + userid).once('value', (snapShot) => {
    //         //not belong
    //         if (snapShot.val() == null) {
    //             res.status(403);
    //             res.json({
    //                 'status': 403,
    //                 "message": "User does not belong company"
    //             })
    //         } else {
    //             //belong
    //             foodRef.child('/' + company).limitToLast(20).once('value', (snapShot) => {
    //                 if (snapShot.val() == null) {
    //                     res.status(404);
    //                     res.json({
    //                         "status": 404,
    //                         "message": "No data found"
    //                     })
    //                 } else {
    //                     res.status(200);
    //                     res.json(
    //                         snapShot.val()
    //                     )
    //                 }
    //             })
    //         }
    //     })
    // },

    // getDrink: function(req, res) {
    //     console.log("product.getDrink");
    //     var username = req.body.username || '';
    //     var userid = req.body.userid || '';
    //     var token = req.body.access_token || '';
    //     var company = req.body.company || '';

    //     if (username == '' || token == '' || userid == '') {
    //         res.status(401);
    //         res.json({
    //             'status': 401,
    //             'message': 'Invalid credentitals'
    //         });
    //         return;
    //     }
    //     //Check if user belong company or not
    //     companyRef.child('/' + company + "/member/" + userid).once('value', (snapShot) => {
    //         //not belong
    //         if (snapShot.val() == null) {
    //             res.status(403);
    //             res.json({
    //                 'status': 403,
    //                 "message": "User does not belong company"
    //             })
    //         } else {
    //             //belong
    //             drinkRef.child('/' + company).limitToLast(20).once('value', (snapShot) => {
    //                 if (snapShot.val() == null) {
    //                     res.status(404);
    //                     res.json({
    //                         "status": 404,
    //                         "message": "No data found"
    //                     })
    //                 } else {
    //                     res.status(200);
    //                     res.json(
    //                         snapShot.val()
    //                     )
    //                 }
    //             })
    //         }
    //     })
    // },

    getProducts: function(req, res) {
        console.log("product.getFood");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var token = req.body.access_token || '';
        var company = req.body.company;

        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }
        //Check if user belong company or not
        companyRef.child('/' + company + "/member/" + userid).once('value', (snapShot) => {
            //not belong
            if (snapShot.val() == null) {
                res.status(403);
                res.json({
                    'status': 403,
                    "message": "User does not belong company"
                })
            } else {
                //belong
                productRef.child('/' + company).limitToLast(20).once('value', (snapShot) => {
                    if (snapShot.val() == null) {
                        res.status(404);
                        res.json({
                            "status": 404,
                            "message": "No data found"
                        })
                    } else {
                        res.status(200);
                        res.json(
                            snapShot.val()
                        )
                    }
                })
            }
        })
    },
    order: function(req, res) {
        console.log("product.order");
        var username = req.body.username || '';
        var userid = req.body.userid || '';
        var token = req.body.access_token || '';
        var company = req.body.company || '';
        var productid = req.body.productid || '';
        var quantity = req.body.quantity || '';

        if (username == '' || token == '' || userid == '') {
            res.status(401);
            res.json({
                'status': 401,
                'message': 'Invalid credentitals'
            });
            return;
        }

        if (product == '' || quantity == '') {
            res.status(406);
            res.json({
                'status': 406,
                'message': 'Product is not valid'
            })
            return;
        }

        //Check if user belong company or not
        companyRef.child('/' + company + "/member/" + userid).once('value', (snapShot) => {
            //not belong
            if (snapShot.val() == null) {
                res.status(403);
                res.json({
                    'status': 403,
                    "message": "User does not belong company"
                })
            } else {
                //belong
                var date = new Date();
                var currentDate = date.getDate() + "_" + date.getMonth() + "_" + date.getFullYear();
                var orderObj = {};
                orderObj[productid] = {
                    "quantity": quantity,
                    "status": "waitting",
                    "time": date.getTime()
                };
                orderRef.child('/' + company + '/' + currentDate + '/' + userid).push(orderObj);

                res.status(200);
                res.json({
                    'status': 200,
                    "message": "Ordered successfully!"
                })
            }
        })
    }
}

module.exports = product;