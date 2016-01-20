var express = require('express');
var router = express.Router();
var timezone = require('moment-timezone');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.get('/', function(req,res){
    var results = [];
    console.log('unformatted date', req.query.startDate);
    var startDate = timezone(req.query.startDate).tz('America/Chicago').format();
    console.log('formatted date', startDate);

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT menus.start_date, menus.end_date, meals.entree, meals.side_1, meals.side_2, categories.category_name, meal_count.count\
       FROM meal_count\
       JOIN menus ON menus.menu_id = meal_count.menu_id\
       JOIN meals ON meals.meal_id = meal_count.meal_id\
       JOIN categories ON categories.category_id = meal_count.category_id\
       WHERE menus.start_date = $1",
            [startDate]);


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

router.post('/', function(req,res){
    var $insert = "INSERT INTO meal_count (menu_id, meal_id, category_id) VALUES ($1, $2, $3)";
    var $upsert = "UPDATE meal_count";

    var mealArray = req.body;
    pg.connect(connectionString, function(err,client){
        //console.log(req.body);
        for (var i = 0; i<mealArray.length; i++){
            upsertMeal(i, mealArray[i], err, client);
        }
        res.send('updated');
    });

    var upsertMeal = function(i, meal, err, client){
        if(err) {
            console.log(err);
        }
        var results = [];
        //var meal = mealArray[i];
        var checkIfExists = client.query("SELECT * FROM meal_count WHERE menu_id=$1 AND meal_id=$2 AND category_id = $3",
            [meal.menu_id,meal.meal_id,meal.category_id]);

        checkIfExists.on('row', function (row) {
            console.log('checking', row);
            results.push(row);
            console.log('results inside', results);
        });

        console.log('results outside', results);
        // After all data is returned, close connection and return results
        checkIfExists.on('end', function () {
            if (results.length>0){
                console.log('updating');
                client.query("UPDATE meal_count SET count = $4 WHERE menu_id=$1 AND meal_id=$2 AND category_id = $3",
                    [meal.menu_id,meal.meal_id,meal.category_id, meal.count]);
                //res.send("updated");
            }else{
                console.log('inserting');
                client.query("INSERT INTO meal_count (menu_id, meal_id, category_id, count) VALUES ($1,$2,$3,$4)",
                    [meal.menu_id,meal.meal_id,meal.category_id, meal.count]);
                //res.send("inserted");
            }
        });
    }

});

module.exports = router;