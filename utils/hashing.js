const { hash, compare } = require("bcrypt")
const {hmac, createHmac} = require('crypto');
exports.dohash = async (value,saltValue)=>{
    const result = await hash(value,saltValue);
    return result;
}

exports.doHashvalidation = async (value,hasevalue)=>{
    const result = await compare(value,hasevalue);
    return result; 
}

exports.hmacProcess = (value,key)=>{
    const result = createHmac('sha256',key).update(value)
    .digest('hex');
}
