var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var password = require('../routes/password');
var register = require('../routes/register');

var user = require('../routes/user');
var auth = require('../modules/auth');

var createMenu = require('../routes/createmenu');
var getAllergens = require('../routes/getallergens');
var getCategories = require('../routes/getcategories');
var getClients = require('../routes/getclients');
var mealCount = require('../routes/mealcount');
var getMeals = require('../routes/getmeals');
var getMenu = require('../routes/getmenu');
var searchClients = require('../routes/searchclients');
var postMeals = require('../routes/postmeals');
var postClientOrders = require('../routes/postclientorders');


router.post('/',
    passport.authenticate('local'),
    function(req,res){
        console.log(req.user);
        if (req.user.role === 'client') {
            //res.send('/assets/views/client.html');
            res.send('/client');
        } else if (req.user.role === 'admin') {
            res.send('/admin');
            //res.send('/assets/views/admin.html');
        }
    });

router.get("/admin", function(req, res, next){
    res.sendFile(path.join(__dirname, "../public", '/assets/views/admin.html'));
});

router.get("/client", function(req, res, next){
    res.sendFile(path.join(__dirname, "../public", '/assets/views/client.html'));
});

router.get("/", function(req, res, next){
        res.sendFile(path.join(__dirname, "../public", '/assets/views/login.html'));
});

router.use('/register', register);
router.use('/password', password);

//AUTHORIZED AREA
router.use('/*', auth);

router.use('/createmenu', createMenu);
router.use('/getcategories', getCategories);
router.use('/getallergens', getAllergens);
router.use('/getclients', getClients);
router.use('/mealcount', mealCount);
router.use('/getmeals', getMeals);
router.use('/getmenu', getMenu);
router.use('/searchclients', searchClients);
router.use('/postmeals', postMeals);
router.use('/postclientorders', postClientOrders);
router.use('/user', user);


module.exports = router;