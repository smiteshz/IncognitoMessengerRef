var User = require ('../app/models/user.schema');
var Message = require ('../app/models/message.schema');

let onlineClients = {};

module.exports.connection = (client) => {
    console.log("User Connected !");
    client.emit('you are connected', {connected: true, verified: false})
}

module.exports.messageReceived = (client, payload) => {
    sender = payload.sender;
    receiver = payload.receiver;
    console.log("Message Received!")
    process.nextTick(() => {
        User.findOne({'local.userName': payload.receiver}, (err, user) => {
            if (err) throw err;
            if (payload.message == "")
            {
                return;
            } 
            if (user)
            {
                newMessage = new Message;
                newMessage.sender = sender,
                newMessage.receiver = receiver,
                newMessage.message = payload.message
                newMessage.timesent = Math.floor(Date.now() / 1000)
                newMessage.save(err => {
                    if (err) throw err;
                })
                if (onlineClients.hasOwnProperty(payload.receiver))
                {
                    onlineClients[payload.receiver].emit('message', payload.message);
                }
            }
            else
            {
                console.log(`User not Found! ${receiver}`)
            }
        })
    })
}

module.exports.messageFetcher = (client, payload) => {
    receiver = payload.receiver;
    process.nextTick(() => {
        Message.find({'receiver': receiver}, (err, result) => {
            if (err) throw err;
            if (result)
            {
                retrievedMessages = [];
                result.forEach(element => {
                    retrievedMessages.push(element.message)
                });
                console.log("Returning Messages")
                console.log(retrievedMessages);
                client.emit('retrievedmessages', retrievedMessages);
            }
            else{
                console.log("Returning Empty")
                client.emit('retrievedmessages', retrievedMessages);
                return [];
            }
        })
    })
}

module.exports.addOnlineUser = (client, payload) => {
    onlineClients[payload.username] = client;
    console.log(`User succesfully added! ${payload.username}`);
}

module.exports.disconnectUser = client => {
    for(var clients in onlineClients){
        if (onlineClients[clients] == client){
            delete onlineClients[clients];
        }
    }
}

module.exports.ack = (payload) => {
    
}