var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

// GET call to view menu by specific week
router.get('/', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT menus.menu_id, meals.meal_id, meals.entree, meals.side_1, meals.side_2, categories.category_id, categories.category_name\
        FROM menus\
        JOIN meal_menu ON meal_menu.menu_id = menus.menu_id\
        JOIN meals ON meals.meal_id = meal_menu.meal_id\
        JOIN categories ON categories.category_id = meal_menu.category_id\
        WHERE menus.start_date >= $1 AND menus.start_date <= $2\
        ORDER BY menus.start_date ASC, categories.category_id ASC",
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

// DELETE menu_id, meal_id, and category_id from meal_menu table for a specific menu_id
router.delete('/removeMealsFromMenu', function(req,res){

    pg.connect(connectionString, function (err, client) {
        client.query("DELETE FROM meal_menu WHERE menu_id = $1", [req.query.menuId], function(err, result){
            if (err) {
                console.log("Error deleting data! ", err);
                res.send(false);
            }

            res.send(true);
        });
    });
});

module.exports = router;