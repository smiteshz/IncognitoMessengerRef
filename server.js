const express = require('express');
const mongoose = require('./mongoose')();
const bodyParser = require('body-parser');
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

app.get('/users/', UM.displayList);

app.get('/login/', UM.getLogin);
app.post('/login/', UM.login);

io.on('connection', (client) =>{
    client.on('ack', (msg) => {
        console.log('message: '+msg);
    });
    console.log("Client is connected");
    client.on('message', (data) => {
        // Validate the token
        token = data.token;
        var decoded = jwt.verify(token, secret);
        console.log("Decoded string:", decoded);
        userModel.findOne({username: decoded.username, password: decoded.password},(err, person) => {
        if (err)
        {
            console.log(err);
            client.emit('ack', "Unable to send message, authToken invalid");
        }
        else 
        {   
            console.log("Match found!");
            let newMsg = new messageModel(
                data
            )
            newMsg.save().then(result => {
                console.log("Success!");
                client.emit('ack', "Message successfully sent");
            }).catch(err =>
            {
                console.log(err);
                client.emit('ack', `Message sending failed,\n stack trace: ${err}`);
            });
        }
    });
    });  
    client.on('chat message', (msg)=> {
        console.log('message:' +msg);
        io.emit('chat message', msg);
    });
    client.on('disconnect', ()=> {
        console.log('Client is disconnected');
    }) ;
});

app.post('/messages/send/', UM.sendMsg);

app.get('/message/get/:username', UM.getMsg);


server.listen(5000);