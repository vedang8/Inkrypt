const users = require('../models/User');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
    const { name, email, password, profilePicture } = req.body;
    
    if(!name || !email || !password){
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
                name, 
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