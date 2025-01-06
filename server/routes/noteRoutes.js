const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const authenticate = require("../middleware/auth");

router.post('/create', authenticate, noteController.createNewNote);
router.get('/:noteId', authenticate, noteController.getNote);
router.get('/note-list', authenticate, noteController.noteList);

module.exports = router;