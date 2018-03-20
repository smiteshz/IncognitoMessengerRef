const express = require('express');
const mongoose = require('./mongoose')();
const bodyParser = require('body-parser');
const UM = require('./userManagement/user.js');


const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/register/', UM.register);

app.get('/users/', UM.displayList);

app.post('/login/', UM.login);

app.post('/messages/send/', UM.sendMsg);

app.listen(4000);
