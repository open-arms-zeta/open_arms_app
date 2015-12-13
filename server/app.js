var express = require('express');
var app = express();

var index = require('./routes/index');
var getCategories = require('./routes/getcategories');
var getAllergens = require('./routes/getallergens');
var getClients = require('./routes/getclients');
var getMealCount = require('./routes/getmealcount');

app.set("port", process.env.PORT || 5000);

app.use('/getcategories', getCategories);
app.use('/getallergens', getAllergens);
app.use('/getclients', getClients);
app.use('/getmealcount', getMealCount);
app.use('/', index);


app.listen(app.get("port"), function(){
    console.log("Listening on port: ", app.get("port"));
});