

module.exports = (app, passport, io, messaging) => {
app.get('/', (req, res) => {
    res.render('startPage');
});

app.get('/register/', (req, res) => {
    res.render('register');
});

app.post('/register/', passport.authenticate('local-signup', {
    successRedirect: '/login',
    failureRedirect: '/register',
    failureFlash : true
}));

app.get('/login/', (req, res) => {
    res.render('login');
});

app.post('/login/', passport.authenticate('local-login',{
    successRedirect: '/chatpage',
    failureRedirect: '/register',
    failureFlash: true
}));

app.get('/chatpage/', (req, res) => {
    res.render('index');
})

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

io.on('connection', client => {
    messaging.connection(client)
    client.on('message', payload => messaging.messageReceived(payload))
    client.on('getmessages', payload=> messaging.messageFetcher(client, payload))
    client.on('ack', (payload) => messaging.ack(payload));
});


// io.on('connection', (client) =>{
//     client.on('ack', (msg) => {
//         console.log('message: '+msg);
//     });
//     console.log("Client is connected");
//     client.on('message', (data) => {
//         // Validate the token
//         userModel.findOne({username: decoded.username},(err, person) => {
//         if (err)
//         {
//             console.log(err);
//             client.emit('ack', "Unable to send message, authToken invalid");
//         }
//         else 
//         {   
//             console.log("Match found!");
//             let newMsg = new messageModel(
//                 data
//             )
//             newMsg.save().then(result => {
//                 console.log("Success!");
//                 client.emit('ack', "Message successfully sent");
//             }).catch(err =>
//             {
//                 console.log(err);
//                 client.emit('ack', `Message sending failed,\n stack trace: ${err}`);
//             });
//         }
//     }); 
//     });

//     client.on('getmessages', (data) => {
//         console.log('Getting Messages', data.userName);
//         usrname = data.userName;
//         userModel.findOne({username: usrname},(err, person) => {
//         if (err)
//         {
//             console.log(err);
//             client.emit('ack', "Unable to get messages, authToken invalid");
//         }
//         else 
//         {   
//             messageModel.find({receiverName : usrname}, (err, messages) => {
//                 console.log(messages);
//                 client.emit('retrievedmessages', messages);
//             })
//         }
//         });
//     });
// }
// );


};