const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes

const PORT = 7000;
app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));