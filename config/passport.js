var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var auth = require('../config/auth');

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
                User.findOne({'local.userName': username}, (err, user) => {
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'The username already exists'));
                    }
                    var newUser = new User();
                    newUser.local.userName = username;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.token = 'bleh';
                    newUser.local.email = 'bleh';
                    newUser.local.friends = [];
                    newUser.local.verified = true;
                    newUser.save((err) => {
                        if (err) console.log(err);
                        return done(null, newUser);
                    });
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
        usernameField: 'userName',
        passwordField: 'password',
        passReqToCallback : true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            User.findOne({'local.userName': username}, (err, user) => {
                if (err) throw err;
                if (!user)
                {
                    console.log("User Not Found")
                    return done(null, false, req.flash('loginMessage',"User not found, Please Register"));
                }
                if (!user.validPassword(password, user.local.password))
                {
                    console.log("Invalid Pasword")
                    return done(null, false, req.flash('loginMessage', "Invalid Password"));
                }
                else{
                    console.log("Login Successfull")
                    return done(null, user);
                }
            })
        })
    }));

    passport.use('google', new GoogleStrategy({
        'clientID': "513821302879-1gk4m2sh9pfsg36oa4b92s8e9k2e4sib.apps.googleusercontent.com",
        'clientSecret': "Hykhg8jzxc7B_bDV4k8MK8bd",
        'callbackURL': "http://localhost:4000/auth/google/callback/"
    }, 
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({'google.id': profile.id}, (err, user) => {
                if (err) throw err;
                if (user){
                    done(null, user)
                }
                else{
                    let newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token,
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(err => {
                        if (err) throw err;
                        else {
                            return done(null, newUser);
                        }
                    });
                }
            })
        })
    })
    );
}