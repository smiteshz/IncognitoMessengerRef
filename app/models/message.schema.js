const mongoose =  require ('mongoose');

let messageSchema = mongoose.Schema({
    sender : String,
    receiver : String,
    message : String,
    timesent : String
});

module.exports = mongoose.model("message", messageSchema);


messageSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

messageSchema.methods.validPassword = (password, localpassword) => {
    return bcrypt.compareSync(password, localpassword);
}