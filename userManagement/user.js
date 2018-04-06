const mongoose = require('mongoose');
const  jwt = require('jsonwebtoken');
const secret = "totallysecret";
let userModel = mongoose.model("user");
let messageModel = mongoose.model("message");

module.exports.getRegister = (req, res) => {
    res.render('register');
};

module.exports.register = (req, res) => {
    // console.log(`Here's the request body: `);
    // console.log(req.body);
    newUser = new userModel(
        req.body
    );
    newUser.save().then(result => {
        console.log(result);
        res.json({success: true});
    }).catch(
        err => {
            if (err) console.log(err);
            res.json({success: false, stackTrace: err});
        }
    )    
};

module.exports.displayList = (req, res) => {
    userModel.find((err, people) => {
        if (err) return res.status(500).send('There are no users');
        else
        {
            return res.json(people);
        }
    });
};

module.exports.getLogin = (req, res) => {
    res.render('login');
};

module.exports.login = (req, res) => {
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


module.exports.oldlogin = (req, res) => {
    console.log(req.body);
    usrname = req.body.userName;
    pswd = req.body.password;
   //token = req.body.token;
    userModel.findOne({userName: usrname}, (err, people) => {
    if(err) {
        return res.status(404).send('User Not Found');
    }
    else{
        token = people.token;
    if (token != "null")
    {   
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(500).json({success: false});
            if (decoded.userName === usrname && decoded.password === pswd){
                console.log(decoded);
                return res.status(200).render('index');
            }
            
            return res.status(404).json({success: false});
        });
    }
    else{
        userModel.find({userName: usrname, password: pswd}, (err, people) => {
            if (err) {
                return res.status(404).send('User not found');
            }
            else{
                console.log(`User found: ${usrname}`);
                jwt.sign({userName: usrname, password: pswd, valid : true}, secret, (err, tken) => {
                    if (err) return res.status(500).send(err);
                    console.log(`Token Generated!: ${tken}`);
                    userModel.findOneAndUpdate({userName: usrname},{token: tken}, (err, people) => {
                        if (err) res.status(500).send("Internal server error");
                    });
                    res.render('index');
                    //res.json({success: true, userName: usrname, 'token': tken});
                });
                return;
            }
        });
    }
}
});
};

module.exports.sendMsg = (req, res) => {
    try{
        token = req.body.token;
        if (token != "null")
        {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(500).json({success: false});
            console.log("Decoded string:", decoded);
            websocket.listen(4001).sockets;
            userModel.findOne({username: decoded.username, password: decoded.password},(err, person) => {
                if (err) return res.status(401).json({error: "Unauthorized User", stackTrace: err});

                let newMsg = new messageModel(
                    req.body
                )
                newMsg.save().then(result => {
                    return res.status(200).json({success: true, stackTrace:"Message Sent"});
                }).catch(err =>
                {
                    console.log(err);
                    return res.status(500).json({success: false, stackTrace: err});
                });
            });
        });
    }
    }
    catch (err){
        return res.status(401).json({error: "Invalid WebToken", stackTrace: err});
    }
}



module.exports.logOut = (req, res) => {
    userName = req.body.userName;
    userModel.findOneAndUpdate({userName: userName, token: 'null'})
    .then(bleh => res.status(200).send("Successfully Logged out"))
    .catch(err => res.status(500));
}


module.exports.webSocketTest = (client) =>{
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
        usrname = data.username;
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
            console.log("Match found!");
            messageModel.find({receiverName : usrname}, (err, messages) => {
                client.emit('retrivedmessages', messages);
            })
        }
        });
    });
}

module.exports.entryPage = (req, res) => {
    res.render('index');
}
