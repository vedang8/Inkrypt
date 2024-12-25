const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

exports.generateAuthToken = async (userId) => {
    try{
        let token1 = jwt.sign({_id: userId}, JWT_SECRET, {
            expiresIn: "1h"
        });
        this.tokens = this.tokens.concat({ token: token1 });
        await this.save();
        return token1;
    }catch(error){
        console.error("Error generating token:", error.message);
        throw new Error("Token generation failed");
    }
}