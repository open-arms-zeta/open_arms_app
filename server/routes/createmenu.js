var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';



// GET call to populate drop-down menus by categories
router.get('/meals', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meals.meal_id, meals.entree, meals.side_1, meals.side_2, categories.category_id, categories.category_name\
        FROM meals\
        JOIN meal_category ON meals.meal_id = meal_category.meal_id\
        JOIN categories ON categories.category_id = meal_category.category_id\
        WHERE meals.status = true\
        ORDER BY categories.category_id ASC");


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

// GET call to query allergen information
//router.get('/allergens', function(req,res){
//    console.log(req.query);
//    var results = [];
//
//    pg.connect(connectionString, function (err, client) {
//        var query = client.query("SELECT meals.meal_id, allergens.allergen_name, allergenspecific.specific_name\
//        FROM meals\
//        JOIN meal_allergen_allergenspecific ON meal_allergen_allergenspecific.meal_id = meals.meal_id\
//        JOIN allergens ON meal_allergen_allergenspecific.allergen_id = allergens.allergen_id\
//        JOIN allergenspecific ON meal_allergen_allergenspecific.allergenspecific_id = allergenspecific.specific_id\
//        WHERE meals.meal_id = $1", [req.query.mealId]);
//
//
//        // Stream results back one row at a time, push into results array
//        query.on('row', function (row) {
//            results.push(row);
//        });
//
//        // After all data is returned, close connection and return results
//        query.on('end', function () {
//            client.end();
//            return res.json(results);
//        });
//
//        // Handle Errors
//        if (err) {
//            console.log(err);
//        }
//    });
//});

// POST call to create new menu in menus table
router.post('/', function(req,res){

    var newMenu = {
        "startDate": req.body.startDate,
        "endDate":req.body.endDate,
        "weekNumber": req.body.weekNumber,
        "status": false
    };

    //pg.connect(connectionString, function(err, client){
    //    client.query("INSERT INTO menus (start_date, end_date, week_number, status) VALUES ($1, $2, $3, $4)",
    //        [newMenu.startDate, newMenu.endDate, newMenu.weekNumber, newMenu.status],
    //        function (err, result) {
    //            if (err) {
    //                console.log("Error inserting data: ", err);
    //                res.send(false);
    //            }
    //            res.send(true);
    //        });
    //});

});

module.exports = router;