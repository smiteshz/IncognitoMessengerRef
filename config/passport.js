var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//Loading the User Model

var User = require ('../app/models/user.schema');
var Message = require ('../app/models/message.schema');

//Load the Auth Variables


//exporting

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback: true
        }, (req, username, password, done) => {
            //Asynch
            //Function won't run unless data is sent back
            process.nextTick(() => {
                User.findOne({'userName': username}, (err, user) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'The username already exists'));
                    }
                    var newUser = new User();
                    newUser.userName = username;
                    newUser.password = newUser.generateHash(password);
                    newUser.token = "bleh";
                    newUser.email = 'bleh';
                    newUser.verified = true;
                    newUser.save((err) => {
                        if (err) console.log(err);
                        return done(null, newUser);
                    });
                });
            });
        }));
};