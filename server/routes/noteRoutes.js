const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticate = require("../middleware/auth");

router.post('/create', authenticate, noteController.createNewNote);
router.get('/noteList', authenticate, noteController.noteList);
router.get('/:noteId', authenticate, noteController.getNote);
router.patch('/pinn', authenticate, noteController.pinNote);
router.put('/:noteId', authenticate, noteController.saveNote);

module.exports = router;