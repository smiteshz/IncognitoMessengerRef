const mongoose = require('mongoose');

let userModel = mongoose.model("user");

module.exports.register = (req, res) => {
    console.log(req.body);
    newUser = new userModel(
        req.body
    );
    newUser.save().then(result => {console.log(result)}).catch(
        err => {
            if (err) console.log(err);
        }
    )
};
