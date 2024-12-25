const jwt = require('jsonwebtoken');
const users = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const auth = async(req, res, next) => {
    try{
        const token = req.cookies.usercookie
        || req.body.token
        || req.header("Authorization").replace("Bearer ", "");
        //console.log("Token: ", token);
        const verifytoken = jwt.verify(token, JWT_SECRET);
        const rootUser = await users.findOne({_id: verifytoken._id});
        //console.log("root user: ", rootUser);

        if(!rootUser){
            throw new Error("user not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    }catch(error){
        console.log(error);
        res.status(500).json({
            error: "Unauthorized no token provided"
        });
    }
}

module.exports = auth;