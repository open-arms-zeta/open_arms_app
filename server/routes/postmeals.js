/**
 * Created by Thomas on 12/14/15.
 */
var express = require('express');
var router = express.Router();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/open_arms_db';

router.post('/', function(req, res){
    var postMeals = {
        "entree": req.body.entree,
        "side_1": req.body.side_1,
        "side_2": req.body.side_2,
        "status": req.body.status
        //"allergen_name": req.body.allergen_name,
        //"is_specific": req.body.is_specific,
        //"specific_name": req.body.specific_name
    };
    console.log("get request", addMailing);

    pg.connect(connectionString, function(err, client){
        client.query("INSERT INTO meals (entree, side_1, side_2, status) VALUES ($1, $2, $3, $4)",
            [postMeals.entree, postMeals.side_1, postMeals.side_2, postMeals.status],
            function(err, result) {
                if (err) {
                    console.log("error with inserting data", err);
                    res.send(false);
                }

                res.send(true);
            })
    });

});

module.exports = router;