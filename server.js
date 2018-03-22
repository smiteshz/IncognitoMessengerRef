const express = require('express');
const mongoose = require('./mongoose')();
const bodyParser = require('body-parser');
const UM = require('./userManagement/user.js');


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/register/', UM.getRegister);
app.post('/register/', UM.register);

app.get('/users/', UM.displayList);

app.get('/login/', UM.getLogin);
app.post('/login/', UM.login);

app.post('/messages/send/', UM.sendMsg);

app.get('/message/get/:username', UM.getMsg);

app.get('/test/', UM.testReq);

app.listen(4000);
