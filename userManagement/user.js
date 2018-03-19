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

module.exports.login = (req, res) => {
    usrname = req.body.userName;
    pswd = req.body.password;
    token = req.body.token;
    if (token != "null")
    {
        //token = res.body.token;
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
    // res.json({success: true});
};

