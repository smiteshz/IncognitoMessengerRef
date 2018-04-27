const crypto = require('crypto');
const scrypt = require('scrypt');


// Both these functions should be inserted into the client.
// There won't be any server side encryption besides the JWT.

password_locker = (data, key) => {
    var key = new Buffer("pleaseletmein");
    var salt = new Buffer("SodiumChloride");
    //Synchronous
    var result = scrypt.hashSync(key,{"username" : data.username, "password" : data.password},64,salt);
    console.log(result.toString("hex"));
}

encryption = (data, key) => {
    let cipher = crypto.createCipher('aes192', key)
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

decryption = (data, key) => {
    let decipher = crypto.createDecipher('aes192', key);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

let ciphertext = encryption("Hello World", "cat");
console.log(decryption(ciphertext, "cat"));