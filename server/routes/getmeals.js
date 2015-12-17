var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/showAll', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meals.meal_id, meals.entree, meals.side_1, meals.side_2, meals.status\
        FROM meals\
        WHERE meals.status = TRUE");

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

router.get('/mealExtras', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meals.meal_id, meals.entree, meals.side_1, meals.side_2, meals.status, categories.category_name, allergens.allergen_name, meal_allergen_allergenspecific.allergen_specific\
        FROM meals\
        JOIN meal_category ON meals.meal_id = meal_category.meal_id\
        JOIN categories ON categories.category_id = meal_category.category_id\
        JOIN meal_allergen_allergenspecific ON meal_allergen_allergenspecific.meal_id = meals.meal_id\
        JOIN allergens ON meal_allergen_allergenspecific.allergen_id = allergens.allergen_id\
        WHERE meals.status = TRUE AND meals.meal_id = $1", [req.query.meal_id]);

        console.log(req.query);


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


router.get('/searchMeal', function(req,res){

    var results = [];

    pg.connect(connectionString, function (err, client) {

        var query = client.query("SELECT meals.meal_id, meals.entree, meals.side_1, meals.side_2\
      FROM meals\
      WHERE meals.status = TRUE\
      AND (meals.entree ILIKE $1 OR meals.side_1 ILIKE $1 OR meals.side_2 ILIKE $1)",
            ['%' + req.query.searchTerm + '%']);


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

router.put('/changeStatus', function(req,res){
    var results = [];
    console.log(req.body);
    pg.connect(connectionString, function (err, client) {
        client.query("UPDATE meals\
        SET status = FALSE\
        WHERE meal_id = $1", [req.body.meal_id]);

        var query = client.query("SELECT meals.meal_id, meals.entree, meals.side_1, meals.side_2, meals.status\
        FROM meals\
        WHERE meals.status = TRUE");

        console.log(req.query);

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