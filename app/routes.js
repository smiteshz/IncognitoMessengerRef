

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

app.post('/addfriend/', (req, res) =>  {
    messaging.addNewFriend(req, res);
})

app.get('/login/', (req, res) => {
    res.render('login');
});

app.post('/login/', passport.authenticate('local-login',{
    successRedirect: '/chatpage',
    failureRedirect: '/register',
    failureFlash: true
}));

app.get('/chatpage/', (req, res) => {
    //console.log(req);
    res.render('index', {user: req.user});
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
    client.on('message', payload => messaging.messageReceived(client, payload))
    client.on('getmessages', payload => messaging.messageFetcher(client, payload))
    client.on('introduction', payload => messaging.addOnlineUser(client, payload))
    client.on('ack', (payload) => messaging.ack(payload));
});

io.on('disconnection', client => messaging.disconnectUser(client));

};