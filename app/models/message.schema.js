const mongoose =  require ('mongoose');

let messageSchema = mongoose.Schema({
    senderName : {
        type: String,
        required: true
    },
    receiverName : {
        type: String,
        required: true
    },
    token : {
        type: String,
        required: true
    },
    messageBody : {
        type: String,
        required: false
    },
    timeSent: {
        type : Number,
        required: false 
    }
});

module.exports = mongoose.model("message", messageSchema);