const mongoose = require('mongoose');
const  jwt = require('jsonwebtoken');
const secret = "totallysecret";
const websocket =  require('socket.io');
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
    //res.json();
   /* userModel.find({}).then(result=> {
        console.log(result);
       // res.send(result);
        res.json(result);
    
    }).catch(err=> {
        if(err) console.log(err);
        res.json({success: false});
        }
    )*/

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
    console.log(req.body);
    usrname = req.body.userName;
    pswd = req.body.password;
    token = req.body.token;
    if (token != "null")
    {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(500).json({success: false});
            if (decoded.userName === usrname && decoded.password === pswd){
                return res.status(200).json({success: true});
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
                jwt.sign({userName: usrname, password: pswd}, secret, (err, tken) => {
                    if (err) return res.status(500).send(err);
                    console.log(`Token Generated!: ${tken}`);
                    userModel.findOneAndUpdate({userName: usrname},{token: tken}, (err, people) => {
                        if (err) res.status(500).send("Internal server error");
                    });
                    res.json({success: true, userName: usrname, 'token': tken});
                });
                return;
            }
        });
    }
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
    };

module.exports.getMsg = (req, res) => {
    let usrname = req.params.username;

};


module.exports.testReq = (req, res) => {
    console.log("Here");
    console.log(req.get('Sender'));
    console.log(req.get('Receiver'));
    console.log(req.get('Authorization'));
    return res.status(200).send("bleh");
}

module.exports.webSocketTest = (req, res) =>{
    console.log("Connecting to websocket");
}