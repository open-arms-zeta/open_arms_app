var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';



// GET call to populate drop-down menus by categories
router.get('/', function(req,res){
    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT meals.entree, meals.side_1, meals.side_2, categories.category_name, allergens.allergen_name, allergenspecific.specific_name\
        FROM meals\
        JOIN meal_category ON meals.meal_id = meal_category.meal_id\
        JOIN categories ON categories.category_id = meal_category.category_id\
        JOIN meal_allergen_allergenspecific ON meal_allergen_allergenspecific.meal_id = meals.meal_id\
        JOIN allergens ON meal_allergen_allergenspecific.allergen_id = allergens.allergen_id\
        JOIN allergenspecific ON meal_allergen_allergenspecific.allergenspecific_id = allergenspecific.specific_id\
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



module.exports = router;