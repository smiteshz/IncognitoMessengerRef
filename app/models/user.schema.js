const mongoose  =  require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
    local: {
        userName: {
            type : String
        },
        password : {
            type : String
            // required : true
        },
        email : {
            type : String
            // required : true
        }
    },
    google : {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

userSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = (password, localpassword) => {
    return bcrypt.compareSync(password, localpassword);
}



module.exports = mongoose.model("user", userSchema);