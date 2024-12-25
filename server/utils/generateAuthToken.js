const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

exports.generateAuthToken = (userId) => {
    try{
        let token1 = jwt.sign({_id: userId}, JWT_SECRET, {
            expiresIn: "1h"
        });
        return token1;
    }catch(error){
        console.error("Error generating token:", error.message);
        throw new Error("Token generation failed");
    }
}