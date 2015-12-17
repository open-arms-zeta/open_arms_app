/**
 * Created by Thomas on 12/14/15.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.post('/saveToMealsTable', function(req, res){

    //console.log(req.body);

    var postMeals = {
        "entree": req.body.entree,
        "side_1": req.body.side_1,
        "side_2": req.body.side_2,
        "status": req.body.status
    };
    console.log("post request", postMeals);

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO meals (entree, side_1, side_2, status) VALUES ($1, $2, $3, $4)",
            [postMeals.entree, postMeals.side_1, postMeals.side_2, postMeals.status],
            function(err, result) {
                if (err) {
                    console.log("error with inserting data", err);
                    res.send(false);
                }

                res.send(result);
            });
    });

});


router.get('/getNewMealID', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meal_id\
        FROM meals\
        ORDER BY meal_id DESC");

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




router.post('/', function(req, res){
    var mealAllergenAllergenspecific = {
        "meal_id": req.body.meal_id,
        "allergen_id": req.body.allergen_id
    };
    console.log("post request", mealAllergenAllergenspecific);

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO meal_allergen (meal_id, allergen_id) VALUES ($1, $2)",
            [mealAllergenAllergenspecific.meal_id, mealAllergenAllergenspecific.allergen_id, mealAllergenAllergenspecific.allergenspecific_id],
            function(err, result) {
                if (err) {
                    console.log("error with inserting data", err);
                    res.send(false);
                }

                res.send(true);
            })
    });

});

router.post('/postToMealCategory', function(req, res){

    console.log(req.body);

    var mealCategory = {
        "meal_id": req.body.mealId
    };

    pg.connect(connectionString, function (err, client){

        for(var i = 0; i < req.body.mealObject.categories.length; i++) {

            mealCategory.category_id = req.body.mealObject.categories[i].category_id;
            console.log(mealCategory);

            var q = "INSERT INTO meal_category (meal_id, category_id) VALUES ($1, $2)";
            console.log("query: ", q);
            console.log(mealCategory.meal_id, mealCategory.category_id);
            var result = client.query(q, [mealCategory.meal_id, mealCategory.category_id]);
        }

        if(err) console.log(err);

        result.on('end', function () {
            client.end();
        });

    });

    res.send("save success");


});


module.exports = router;