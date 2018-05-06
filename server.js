//Imports
const mongoose = require('mongoose');
const express = require('express');
const configDB = require('./config/database');
const bodyParser = require('body-parser');
const secret = "totallysecret";
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const port = process.env.port || 4000;

var morgan = require('morgan');

var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var messaging = require('./app/messaging');


//Configuration
mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.set('view engine', 'ejs');

app.use(morgan('dev')); //Logging
app.use(cookieParser()); //Parsing Cookie information
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
})); // 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Redirecting the routes

require('./app/routes')(app, passport, io, messaging);


server.listen(port);