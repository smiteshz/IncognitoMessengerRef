var User = require ('../app/models/user.schema');
var Message = require ('../app/models/message.schema');

module.exports.connection = (client) => {
    console.log("User Connected !");
    console.log(client);
}