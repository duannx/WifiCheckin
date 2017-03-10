var express = require('express');
var router = express.Router();

var auth = require('./auth.js');
var checkin = require('./checkin.js');
var product = require('./products.js');
var user = require('./users.js');

var apiPath = "/api/v1/";

//Routes can be access by any one
router.post('/login', auth.login);
router.post('/register', auth.register);
router.get('/register/confirm/:email/:code', auth.confirmEmail);

//Routes can be access only by authenticated and authorized users
router.post(apiPath + 'logout', auth.logout);
router.post(apiPath + 'checkin', checkin.checkin);
router.get(apiPath + 'checkin', checkin.getCheckinInfo)
router.post(apiPath + 'checkout', checkin.checkout);
router.post(apiPath + 'history', checkin.history);
router.post(apiPath + 'admin/history', checkin.adminHistory);

router.post(apiPath + 'products/food', product.getFood);
router.post(apiPath + 'products/drink', product.getDrink);
router.post(apiPath + 'products/order', product.order);

module.exports = router;