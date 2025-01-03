const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require("../middleware/auth");

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/validuser', authenticate, userController.validUser);
router.get('/logout', authenticate, userController.logOut);

module.exports = router;