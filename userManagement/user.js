const mongoose = require('mongoose');
const  jwt = require('jsonwebtoken');
const secret = "totallysecret";
let userModel = mongoose.model("user");

module.exports.register = (req, res) => {
    console.log(`Here's the request body: `);
    console.log(req.body);
    newUser = new userModel(
        req.body
    );
    newUser.save().then(result => {
        console.log(result);
        res.json({success: true});
    }).catch(
        err => {
            if (err) console.log(err);
            res.json({success: false})
        }
    )    
};

module.exports.displayList = (req, res) => {
    res.json();
};

module.exports.login = (req, res) => {
    usrname = req.body.userName;
    pswd = req.body.password;
    token = req.body.token;
    if (token != "null")
    {
        //token = res.body.token;
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(500).json({success: false});
            console.log("User has already logged in");
            return res.status(200).json({success: true});
        });

    }
    else{
        userModel.find({userName: usrname, password: pswd}, (err, people) => {
            if (err) {
                return res.status(404).send('User not found');
            }
            else{
                console.log(`User found: ${usrname}`);
                jwt.sign({userName: usrname, password: pswd}, secret, (err, token) => {
                    if (err) return res.status(500).send(err);
                    console.log(`Token Generated!: ${token}`);
                    res.json({success: true, userName: usrname, 'token': token});
                });
                return;
            }
        });
    }
    // res.json({success: true});
};

