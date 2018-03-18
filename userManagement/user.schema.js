const mongoose  =  require('mongoose');

let userSchema = mongoose.Schema({
    userName: {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    verified : {
        type : Boolean,
        required : false,
        default : false
    },
    token : {
        type : String,
        required : false,
        default : "null"
    }
});

mongoose.model("user", userSchema);