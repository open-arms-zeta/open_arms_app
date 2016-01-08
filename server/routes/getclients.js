var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT users.first_name, users.last_name, meals.entree, meals.side_1, \
        meals.side_2, categories.category_name, client_orders.count, menus.menu_id, menus.start_date, menus.end_date\
        FROM meals\
        JOIN client_orders\
        ON client_orders.meal_id = meals.meal_id\
        JOIN users\
        ON client_orders.client_id = users.id\
        JOIN menus\
        ON client_orders.menu_id = menus.menu_id\
        JOIN categories\
        ON categories.category_id = client_orders.category_id\
        WHERE users.role = 'client' AND menus.start_date = $1\
        ORDER BY menus.start_date, users.last_name ASC",
            [req.query.startDate]);


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

router.get('/checkOrdered', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meals.entree, meals.side_1, meals.side_2, client_orders.count \
        FROM client_orders \
        JOIN meals ON client_orders.meal_id = meals.meal_id\
        WHERE client_id = $1 AND menu_id = $2",
            [req.query.clientId, req.query.menuId]);


        // Stream results back one row at a time, push into results array
        query.on('row', function (row) {
            results.push(row);
            console.log("This is row", row);
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

router.put('/updateNewUser', function(req,res){
    //console.log(req.body);


    pg.connect(connectionString, function(err, client){
        client.query("UPDATE users\
        SET new_user = false\
        WHERE id = $1", [req.body.id]);
        // Handle Errors
        if (err) {
            console.log(err);
        }

        res.send(true);
    });
});

module.exports = router;