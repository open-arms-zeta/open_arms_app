var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
var pg = require('pg');
var bcrypt = require('bcrypt');

var connectionString = "";

if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + "?ssl=true";
} else {
    connectionString = 'postgres://localhost:5432/open_arms_db';
}



router.post('/reset', function(req, res) {

    var user = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hashedPassword = bcrypt.hashSync(user.password, salt);

    pg.connect(connectionString, function(err, client, done){

        if (err) console.log('error connection to database: ', err);
        client.query("UPDATE users  " +
            "SET salt = $1, password = $2 " +
            "WHERE username = $3;", [salt, hashedPassword, user.email], function(err){
            if(err) {
                console.log(err);
                res.send(false);
            } else {
                res.redirect('/');
            }
        });

    });


});
router.post('/', function(req, res) {
    var result = 0;
    var check = req.body;
    pg.connect(connectionString, function(err, client, done){

        if (err) console.log('error connection to database: ', err);
        var query = client.query("SELECT * " +
            "FROM users " +
            "WHERE email = $1", [check.email]);
        query.on('row', function(row){
            console.log(row);
            result++;
        });
        query.on('end', function(){
            if (result != 1) {


                res.redirect('/');
            } else {
                res.sendFile(path.join(__dirname, "../public", 'views/reset.html'))
            }

        });
    });
});


router.get("/*", function(req, res, next){
    var file = req.params[0] || 'views/password.html';
    res.sendFile(path.join(__dirname, "../public", file));
});

module.exports = router;