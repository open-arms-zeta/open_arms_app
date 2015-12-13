var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/data', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT clients.first_name, clients.last_name, meals.entree, meals.side_1, \
        meals.side_2, categories.category_name, client_orders.count, menus.menu_id, menus.start_date, menus.end_date\
        FROM meals\
        JOIN client_orders\
        ON client_orders.meal_id = meals.meal_id\
        JOIN clients\
        ON client_orders.client_id = clients.client_id\
        JOIN menus\
        ON client_orders.menu_id = menus.menu_id\
        JOIN categories\
        ON categories.category_id = client_orders.category_id\
        WHERE menus.start_date >= $1 AND menus.start_date <= $2\
        ORDER BY menus.start_date, clients.last_name ASC",
            [req.query.start_date, req.query.end_date]);


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