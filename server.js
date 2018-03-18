const express = require('express');
const mongoose = require('./mongoose')();
const bodyParser = require('body-parser');
const UM = require('./userManagement/user.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.post('/register/', UM.register);

app.get('/users/', UM.displayList);

app.listen(4000);
