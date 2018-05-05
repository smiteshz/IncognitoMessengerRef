

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

app.get('/auth/google/', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

app.get('/logout/',  (req, res) => {
    console.log(req)
    req.logout();
    res.redirect('/');
});

let isLoggedin = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

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