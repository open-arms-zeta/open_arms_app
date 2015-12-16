var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var Model = require('../models/models');
var bcrypt = require('bcrypt');

passport.serializeUser(function(user, done){

    done(null, user.id);
});

passport.deserializeUser(function(id, done) {


    Model.User.findOne({
        where: {
            'id': id
        }
    }).then(function (user) {
        if (user == null) {
            done(new Error('Wrong user id.'))
        }

        done(null, user)
    })
});

passport.use(new localStrategy(
    function(email, password, done) {

        Model.User.findOne({
            where: {
                'email': email
            }
        }).then(function (user) {
            console.log(user);
            if (user == null) {
                return done(null, false, { message: 'Incorrect credentials.' })
            }

            var hashedPassword = bcrypt.hashSync(password, user.salt);

            if (user.password === hashedPassword) {
                return done(null, user)
            }

            return done(null, false, { message: 'Incorrect credentials.' })
        })
    }
));

module.exports = passport;