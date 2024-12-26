const users = require('../models/User');
const bcrypt = require('bcryptjs');
const generateAuthToken = require("../utils/generateAuthToken");

// Register a new user
exports.register = async (req, res) => {
    const { fname, email, password, profilePicture } = req.body;
    console.log("name: ", fname);
    if(!fname || !email || !password){
        return res.status(422).json({
            status: 422,
            error: "All fields are required"
        });
    }
    try{
        // Check if user already exists
        const preuser = await users.findOne({email: email});
        if(preuser){
            return res.status(422).json({
                status: 422,
                error: "This email is already registered"
            });
        }else{
            // If it is a new user
            // Create and hash user password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Save user to the database
            const user = new users({
                fname, 
                email, 
                password: hashedPassword,
                profilePicture
            });

            await user.save();

            return res.status(201).json({
                status: 201,
                message: "User registered successfully"
            });
        }
    }catch(error){
        console.error("Failed to register user: ", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(422).json({
            status: 422,
            error: "All fields are required"
        });
    }
    try{
        const userValid = await users.findOne({email: email});

        if(!userValid){
            return res.status(422).json({
                status: 422,
                error: "Invalid details"
            });
        }

        // matching the password
        const isMatch = await bcrypt.compare(password, userValid.password);
        if(!isMatch){
            return res.status(422).json({
                status: 422,
                error: "Invalid details"
            });
        }

        // Generate token
        const token = generateAuthToken(userValid._id);
        if(token){
            userValid.tokens.push({token});
            await userValid.save();

            // set cookie with th token
            res.cookie("usercookie", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true
            });
            
            return res.status(201).json({
                status: 201,
                message: "User is Logged in Successfully",
                name: userValid.fname ,
                token
            });
        }        
    }catch(error){
        console.error("Login failed: ", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};