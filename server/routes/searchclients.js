var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var name = '%' + req.query.name + '%';
        var query = client.query("SELECT first_name, last_name, email, phone, default_meal, status " +
            "FROM clients WHERE clients.first_name ILIKE $1 OR clients.last_name ILIKE $1",
            [name]);


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