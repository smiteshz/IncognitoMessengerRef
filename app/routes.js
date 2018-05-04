

module.exports = (app, passport, io) => {
app.get('/', (req, res) => {
    res.render('startPage');
});

app.get('/register/', (req, res) => {
    res.render('register');
});

app.post('/register/', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash : true
}));

app.get('/login/', (req, res) => {
    res.render('login');
});

app.post('/login/', (req, res) => {
    username = req.body.userName;
    userModel.findOne({userName: username}, (err, people) => {
        if (err) return res.status(404).send("User not found");
        else if(req.body.token)
        {
            userModel.findOne({userName: people.username, token: req.body.token}, (err, people) => {
                if (err) return res.status(401).send("Access Denied, Invalid Token");
                else{
                    res.status(200).send("Access Granted, Token valid");
                }
            })
        }
        else if (req.body.password)
        {
            userModel.findOne({userName: people.username, password: req.body.password}, (err, people) => {
                if (err) return res.status(401).send("Access Denied, Invalid Password");
                else{
                    jwt.sign({userName: people.username, password: req.body.password, log: true}, secret, (err, token) => {
                        userModel.findOneAndUpdate({userName: people.username, password: req.body.password, token: token}, (err, people) => {
                            if (err) return console.log(err);
                            else{
                                res.status(200).send("Access Granted, Token Validated");
                            }
                        });
                    });
                }
            })
        }
    })
}
);

app.post('/logout/',  (req, res) => {
    userName = req.body.userName;
    userModel.findOneAndUpdate({userName: userName}, {token: 'null'}) 
    .then(bleh => res.status(200).send("Successfully Logged out"))
    .catch(err => res.status(500));
});

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
        userModel.findOne({username: decoded.username, token: data.token},(err, person) => {
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

    client.on('getmessages', (data) => {
        console.log('Getting Messages', data.userName);
        usrname = data.userName;
        // Validate the token
        token = data.token;
        var decoded = jwt.verify(token, secret);
        console.log("Decoded string:", decoded);
        userModel.findOne({username: decoded.username, token: data.token},(err, person) => {
        if (err)
        {
            console.log(err);
            client.emit('ack', "Unable to get messages, authToken invalid");
        }
        else 
        {   
            messageModel.find({receiverName : usrname}, (err, messages) => {
                console.log(messages);
                client.emit('retrievedmessages', messages);
            })
        }
        });
    });
}
);
tokenValidation = (tokenString) => {
    var result = false;
    decoded = jwt.verify(tokenString, secret);
    userModel.findOne({userName: decoded.userName, password: decoded.password})
    .then(detected => {result = true})
    .catch(err => {result = false});
    return result;
}
};