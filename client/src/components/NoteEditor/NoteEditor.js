import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";
import Toolbar from "../Toolbar/Toolbar";
import debounce from 'lodash/debounce';
import { io } from "socket.io-client";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';

const NoteEditor = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [note, setNote] = useState({ title: "", content: "", tags: [] });
    const [quill, setQuill] = useState(null);
    const socket = useRef(null);
    const [value, setValue] = useState('');
    useEffect(() => {
        socket.current = io("http://localhost:7000", { transports: ["websocket", "polling", "flashsocket"] });
        socket.current.on("connect", () => console.log("Connected to WebSocket"));
        socket.current.on("noteUpdate", (updatedNote) => {
            if (updatedNote.id === noteId) {
                setNote(updatedNote);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [noteId]);

    const handleContentChange = (value) => {
        setNote((prev) => ({ ...prev, content: value }));
        debouncedSave(value);
    };

    const handleTitleChange = async (e) => {
        const updatedTitle = e.target.value;
        setNote((prev) => ({ ...prev, title: updatedTitle }));
        await saveNote(updatedTitle, note.content);  // Save title change as well
    };

    const saveNote = async (title, content) => {
        try {
            const response = await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usersdatatoken"),
                },
                body: JSON.stringify({ title, content }),  // Send both title and content
            });

            if (!response.ok) {
                throw new Error("Failed to save the note");
            }
            socket.current.emit("noteUpdate", { id: noteId, title, content });
            message.success("Note saved successfully");
        } catch (error) {
            console.error(error);
            message.error("Failed to save the note");
        }
    };

    const debouncedSave = useRef(debounce(saveNote, 1000)).current;

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
            if (data.status === 201) {
                setNote(data);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            message.error("Error Fetching Note");
        } finally {
            dispatch(setLoader(false));
        }
    };

    // defining toolbar options
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false]}],
            ['bold', 'italic', 'underline', 'strike'],
            [{color: []}, {background: []}],
            [{font: ['sans-serif', 'serif', 'times-new-roman', 'arial']}],
            [{size: ['small', false, 'large', 'huge']}],
            [{align: []}],
            ['blockquote', 'code-block'],
            [{list: 'ordered'}, {list: 'bullet'}],
            ['link', 'image'],
            ['clean'],
            ['close'],
        ],
    };
    useEffect(() => {
        fetchNote();
    }, [noteId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white shadow-lg rounded-md max-w-4xl w-full p-6">
                <div className="sticky top-0 bg-white px-6 py-4 space-y-4">
                    <input
                        type="text"
                        value={note.title}
                        onChange={handleTitleChange}
                        className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-600"
                        placeholder="Enter note title"
                    />
                    <ReactQuill value={value} onCange={setValue} modules={modules} />
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
