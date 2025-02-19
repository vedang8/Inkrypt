require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const socketIo = require("socket.io");
const http = require("http");
require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT"]
    }
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
    req.io = io;
    next();
});
// Routes
app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);

server.listen(process.env.PORT, ()=> console.log(`Server is running on port ${process.env.PORT}`));