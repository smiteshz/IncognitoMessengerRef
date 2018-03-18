const mongoose = require('mongoose');

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
    
};