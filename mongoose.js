const mongoose = require('mongoose');
let config = require('./config.js');

module.exports = () => {
    mongoose.connect(config.configuration.dbconnection).catch(err => {
        if (err) console.log("Invalid Connection");
    });
    require('./userManagement/user.schema');
    require('./userManagement/message.schema');
    let userModel = mongoose.model("user");
let messageModel = mongoose.model("message");

}
