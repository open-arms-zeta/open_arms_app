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

// POST call to create new menu in menus table
router.post('/newMenu', function(req,res){

    var newMenu = {
        "startDate": req.body.startDate,
        "endDate":req.body.endDate,
        "weekNumber": req.body.weekNumber,
        "status": false
    };

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO menus (start_date, end_date, week_number, status) VALUES ($1, $2, $3, $4)",
            [newMenu.startDate, newMenu.endDate, newMenu.weekNumber, newMenu.status],
            function (err, result) {
                if (err) {
                    console.log("Error inserting data: ", err);
                    res.send(false);
                }
                res.send(true);
            });
    });

});

// GET call to obtain the menu_id of newly created menu
router.get('/getMenuId', function(req,res){

    console.log(req.query);

    var results = [];

    pg.connect(connectionString, function (err, client) {
        var query = client.query("SELECT menus.menu_id\
        FROM menus\
        WHERE menus.start_date = $1",
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

// POST call to save menu_id, meal_id's and category_id's to meal_menu table
router.post('/saveToMealMenu', function(req,res){

    //for(var i = 0; i < req.body.mealsArray.length; i++){
    //
    //    var newMealMenu = {
    //        "menuId": req.body.menuId,
    //        "mealId": req.body.mealsArray[i].meal_id,
    //        "categoryId": req.body.mealsArray[i].category_id
    //    };
    //
    //    //console.log(newMealMenu.menuId, newMealMenu.mealId ,newMealMenu.categoryId);
    //    save(newMealMenu);
    //
    //}
    //
    //res.send("save success");

    pg.connect(connectionString, function (err, client){

        console.log("SAVING to meal_menu", req.body);

        for(var i = 0; i < req.body.mealsArray.length; i++){

            var newMealMenu = {
                "menuId": req.body.menuId,
                "mealId": req.body.mealsArray[i].meal_id,
                "categoryId": req.body.mealsArray[i].category_id
            };

            var q = "INSERT INTO meal_menu (menu_id, meal_id, category_id) VALUES ($1, $2, $3)";
            //console.log("query: ", q);
            //console.log(newMealMenu.menuId, newMealMenu.mealId ,newMealMenu.categoryId);
            var result = client.query(q, [newMealMenu.menuId, newMealMenu.mealId, newMealMenu.categoryId]);

            if(err) console.log(err);

            //console.log(newMealMenu.menuId, newMealMenu.mealId ,newMealMenu.categoryId);
            //save(newMealMenu);
        }

        //client.end();
        result.on('end', function () {
            client.end();
        });
    });


    res.send("save success");
});

//function save(newMealMenu) {
//    pg.connect(connectionString, function (err, client){
//
//        var q = "INSERT INTO meal_menu (menu_id, meal_id, category_id) VALUES ($1, $2, $3)";
//        //console.log("query: ", q);
//        //console.log(newMealMenu.menuId, newMealMenu.mealId ,newMealMenu.categoryId);
//        var result = client.query(q, [newMealMenu.menuId, newMealMenu.mealId, newMealMenu.categoryId]);
//
//        if(err) console.log(err);
//
//        result.on('end', function () {
//            client.end();
//        });
//
//    });
//}


module.exports = router;