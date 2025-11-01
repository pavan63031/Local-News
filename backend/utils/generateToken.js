const jwt = require('jsonwebtoken');
const secret = "pavab112inw"

function generateToken(user){
    return jwt.sign({...user},secret);
}

function verifyToken(token){
    return jwt.verify(token,secret, { expiresIn: "1d" });
}

module.exports = {
    generateToken,
    verifyToken
}