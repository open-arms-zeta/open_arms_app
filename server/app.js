var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var index = require('./routes/index');
var createMenu = require('./routes/createmenu');
var getAllergens = require('./routes/getallergens');
var getCategories = require('./routes/getcategories');
var getClients = require('./routes/getclients');
var getMealCount = require('./routes/getmealcount');
var getMeals = require('./routes/getmeals');
var getMenu = require('./routes/getmenu');
var searchClients = require('./routes/searchclients');

app.set("port", process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));


app.use('/createmenu', createMenu);
app.use('/getcategories', getCategories);
app.use('/getallergens', getAllergens);
app.use('/getclients', getClients);
app.use('/getmealcount', getMealCount);
app.use('/getmeals', getMeals);
app.use('/getmenu', getMenu);
app.use('/searchclients', searchClients);
app.use('/', index);


app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});