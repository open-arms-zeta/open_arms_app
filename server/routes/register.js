var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Model = require('../models/models');
var bcrypt = require('bcrypt');

var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';


router.post('/', function(req,res,next) {
    var client = req.body;


    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(client.password, salt);

    var newUser = {
        email: client.email,
        first_name: client.firstName,
        last_name: client.lastName,
        phone: client.phone,
        default_meal: client.defaultMeal.category_name,
        category_id: client.defaultMeal.category_id,
        status: true,
        new_user: true,
        role: 'client',
        salt: salt,
        password: hashedPassword
    };

    Model.User.create(newUser).then(function () {
        res.send('user added to database');
    }).catch(function (error) {
        res.redirect('/register')
    });

});

router.get('/admin', function (req, res, next){
    res.sendFile(path.resolve(__dirname, '../public/assets/views/registeradmin.html'));
});

router.post('/admin', function(req,res,next){
    var admin = req.body;
    console.log(admin);

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(admin.password, salt);

    var newUser = {
        email: admin.username,
        role: 'admin',
        salt: salt,
        password: hashedPassword
    };

    Model.User.create(newUser).then(function () {
        res.send('/')
    }).catch(function (error) {
        res.send('/register')
    });

});

//Check emails
router.get('/all', function(req,res){
    console.log('retrieving emails')
    var results = [];

    pg.connect(connectionString, function (err, client) {

        var query = client.query("SELECT email FROM users");

        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if (err) {
            console.log(err);
        }
    });
});

module.exports = router;