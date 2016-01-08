var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';


// POST client orders to client_orders table
router.post('/saveClientOrders', function(req, res){

    //pg.connect(connectionString, function (err, client){


        for(var i = 0; i < req.body.length; i++){

            var clientOrder = {
                "clientId": req.body[i].clientId,
                "menuId": req.body[i].menuId,
                "mealId": req.body[i].mealId,
                "categoryId": req.body[i].categoryId,
                "count": req.body[i].count
            };

            //console.log(clientOrder);
            save(clientOrder);

            //var q = "INSERT INTO client_orders (client_id, menu_id, meal_id, category_id, count) VALUES ($1, $2, $3, $4, $5)";
            //
            //var result = client.query(q, [clientOrder.clientId, clientOrder.menuId, clientOrder.mealId, clientOrder.categoryId, clientOrder.count]);
            //
            //if(err) console.log(err);

    }

    //result.on('end', function () {
    //    client.end();
    //});

    //});

    res.send("save success");
});

function save(clientOrder) {
    pg.connect(connectionString, function (err, client){

        var q = "INSERT INTO client_orders (client_id, menu_id, meal_id, category_id, count) VALUES ($1, $2, $3, $4, $5)";

        var result = client.query(q, [clientOrder.clientId, clientOrder.menuId, clientOrder.mealId, clientOrder.categoryId, clientOrder.count]);

        if(err) console.log(err);

        result.on('end', function () {
            client.end();
        });

    });
}

module.exports = router;