const notes = require("../models/Note");
const {v4: uuidv4} = require('uuid');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

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
            noteId: note.noteId,
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

exports.noteList = async (req, res) => {
    try{
        const allNotes = await notes.find({user: (req.userId)});
        if(allNotes.length === 0){
            return res.status(404).json({
                status: 404,
                message: "Notes not found"
            });
        }
        const notesList = allNotes.map(note => ({
            noteId: note.noteId,
            title: note.title,
            isPinned: note.isPinned
        }));
        return res.status(201).json({
            status: 201,
            note: notesList
        });
    }catch(error){
        console.error("Error in Listing Notes", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};

exports.pinNote = async (req, res) => {
    try{
        const { noteId, pinned } = req.body;

        // validating the request body
        if(!noteId || typeof pinned === "undefined"){
            return res.status(400).json({
                status: 400,
                error: "Invalid request payload"
            });
        }

        const updatedNote = await notes.findOneAndUpdate({ noteId }, { isPinned: pinned }, { new: true });
        if(!updatedNote){
            return res.status(404).json({
                status: 404,
                error: "Note not Found",
            });
        }else{
            return res.status(201).json({
                status: 201,
                message: "Note's state is updated successfully",
            });
        }
    }catch(error){
        console.error("Error in updating Notes state", error.message);
        return res.status(500).json({
            status: 500,
            error: "Internal server error"
        });
    }
};

