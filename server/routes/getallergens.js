/**
 * Created by aronthomas on 12/12/15.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/data', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT allergen_name, allergen_id FROM allergens ORDER BY allergen_id ASC");

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