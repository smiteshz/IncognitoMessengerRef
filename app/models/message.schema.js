const mongoose =  require ('mongoose');

let messageSchema = mongoose.Schema({
    sender : String,
    receiver : String,
    message : String,
    timesent : String
});

module.exports = mongoose.model("message", messageSchema);