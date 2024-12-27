require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
require('./config/db');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

app.listen(process.env.PORT, ()=> console.log(`Server is running on port ${process.env.PORT}`));