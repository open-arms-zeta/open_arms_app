var express = require('express');
var app = express();
var path = require('path');
var passport = require('./strategies/user');
var session = require('express-session');
var Model = require('./models/models');
var bodyParser = require('body-parser');

var index = require('./routes/index');

app.set("port", process.env.PORT || 5000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded: true}));


app.use(express.static(path.join(__dirname, '/public')));

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: 'true',
    saveUninitialized: false,
    cookie: {maxage: 600000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());




app.use('/', index);


//SQL Connection, test
Model.User.sync({force: false}).then(function() {
    console.log('Users table exists!!');
    app.listen(app.get("port"), function () {
        console.log("Listening on port: " + app.get("port"));

    });
});