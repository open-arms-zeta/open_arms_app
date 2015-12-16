var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT menus.start_date, menus.end_date, meals.entree, meals.side_1, meals.side_2, categories.category_name, meal_count.count\
       FROM meal_count\
       JOIN menus ON menus.menu_id = meal_count.menu_id\
       JOIN meals ON meals.meal_id = meal_count.meal_id\
       JOIN categories ON categories.category_id = meal_count.category_id\
       WHERE menus.start_date >= $1 AND menus.start_date <= $2",
            [req.query.startDate, req.query.endDate]);


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