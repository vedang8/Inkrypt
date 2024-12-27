const notes = require("../models/Note");
const {v4: uuidv4} = require('uuid');

// Create a new note
exports.createNewNote = async (req, res) => {
    try{
        const newNote = new notes({
            user: req.userId,
            noteId: uuidv4(),
            title: "Untitled",
            content: "",
            tags: [],
            isPinned: false,
            isEncrypted: false,
        });
        const savedNote = await newNote.save();
        return res.status(201).json({
            status: 201,
            noteId: savedNote.noteId
        });
    }catch(error){
        console.error("Error in creating a note", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};

// get a note
exports.getNote = async (req, res) => {
    try{
        const { noteId } = req.params;
        const note = await notes.findOne({noteId: noteId});
        if(!note){
            return res.status(404).json({
                status: 404,
                message: "Note not found"
            });
        }
        return res.status(201).json({
            status: 201,
            title: note.title,
            content: note.content,
            isPinned: note.isPinned,
            isEncrypted: note.isEncrypted
        });
    }catch(error){
        console.error("Error in fetching a note", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};