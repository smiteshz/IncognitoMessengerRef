const express = require('express');
const mongoose = require('./mongoose')();
const bodyParser = require('body-parser');
const  jwt = require('jsonwebtoken');
const secret = "totallysecret";
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const UM = require('./userManagement/user.js');





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', UM.entryPage);
app.get('/register/', UM.getRegister);
app.post('/register/', UM.register);
app.get('/verify/', UM.verify);

app.get('/users/', UM.displayList);

app.get('/login/', UM.getLogin);
app.post('/login/', UM.login);

app.post('/logout/', UM.logOut);

io.on('connection', UM.webSocketTest);


app.post('/messages/send/', UM.sendMsg);



server.listen(5000);