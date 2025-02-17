import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";

import debounce from 'lodash/debounce';
import { io } from "socket.io-client";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const NoteEditor = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // saved content from the backend
    const [savedNote, setSavedNote] = useState({ title: "", content: "" });
    // unaved content (user's current edits)
    const [unsavedNote, setUnsavedNote] = useState({ title: "", content: "" });
    
    const socket = useRef(null);
    const debouncedSave = useRef(null);

    useEffect(() => {
        // Initialize WebSocket connection
        console.log("nOTEID: ",noteId);
        socket.current = io("http://localhost:7000", { transports: ["websocket", "polling", "flashsocket"] });

        socket.current.on("connect", () => console.log("Connected to WebSocket"));

        // Listen for updates form other users
        socket.current.on("noteUpdate", (updatedNote) => {
            if (updatedNote.id === noteId) {
                // update the saved content, but do not overwrite the
                // unsaved content
                setSavedNote(updatedNote);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [noteId]);

    // Save unsaved content to the backend
    const saveNote = async (updatedNote) => {
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usersdatatoken"),
                },
                body: JSON.stringify(updatedNote),
            });

            if (!response.ok) {
                throw new Error("Failed to save the note");
            }

            socket.current.emit("noteUpdate", { id: noteId, ...updatedNote });
            //message.success("Note saved successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to save the note");
        }
    };

    // Debounce the save function to prevent excessive API calls
    debouncedSave.current = debounce((updatedNote) => saveNote(updatedNote), 5000);

    const handleTitleChange = (e) => {
        const updatedTitle = e.target.value;
        setUnsavedNote((prev) => ({ ...prev, title: updatedTitle }));
        debouncedSave.current({ title: updatedTitle, content: unsavedNote.content });
    };

    const handleContentChange = (value) => {
        setUnsavedNote((prev) => ({ ...prev, content: value }));
        debouncedSave.current({ title: unsavedNote.title, content: value });
    };

    const fetchNote = async () => {
        try {
            dispatch(setLoader(true));
            const res = await fetch(`/api/notes/${noteId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usersdatatoken"),
                },
            });
            const data = await res.json();
            if (res.status === 201) { 
                setSavedNote(data);
                setUnsavedNote(data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            message.error("Error Fetching Note");
        } finally {
            dispatch(setLoader(false));
        }
    };

    useEffect(() => {
        fetchNote();
    }, [noteId]);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean'],
        ],
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white shadow-lg rounded-md max-w-4xl w-full p-6">
                <div className="sticky top-0 bg-white px-6 py-4 space-y-4">
                    <input
                        type="text"
                        value={unsavedNote.title}
                        onChange={handleTitleChange}
                        className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-600"
                        placeholder="Enter note title"
                    />
                    <ReactQuill 
                        theme="snow" 
                        value={unsavedNote.content} 
                        onChange={handleContentChange} 
                        modules={modules} 
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
