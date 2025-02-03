import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";
import Toolbar from "../Toolbar/Toolbar";
import debounce from 'lodash/debounce';
import { io } from "socket.io-client";

const NoteEditor = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [note, setNote] = useState({ title: "", content: "", tags: [] });
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const editorRef = useRef(null);
    const socket = useRef(null);

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

    const handleContentChange = (e) => {
        const updatedContent = e.target.innerHTML;
        setNote((prev) => ({ ...prev, content: updatedContent }));
        debouncedSave(updatedContent);
    };

    const handleTitleChange = async (e) => {
        const updatedTitle = e.target.value;
        setNote((prev) => ({ ...prev, title: updatedTitle }));
        await saveNote(updatedTitle, note.content);  // Save title change as well
    };

    const toggleBold = () => {
        document.execCommand("bold");
        setIsBold(document.queryCommandState("bold"));
    };

    const toggleItalic = () => {
        document.execCommand("italic");
        setIsItalic(document.queryCommandState("italic"));
    };

    const toggleUnderline = () => {
        document.execCommand("underline");
        setIsUnderline(document.queryCommandState("underline"));
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

    useEffect(() => {
        const handleSelectionChange = () => {
            setIsBold(document.queryCommandState("bold"));
            setIsItalic(document.queryCommandState("italic"));
            setIsUnderline(document.queryCommandState("underline"));
        };

        document.addEventListener("selectionchange", handleSelectionChange);
        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
        };
    }, []);

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

    useEffect(() => {
        fetchNote();
    }, [noteId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white shadow-lg rounded-md max-w-4xl w-full p-6">
                <div className="sticky top-0 bg-white shadow-md p-4 rounded-md mb-4 flex justify-center">
                    <Toolbar
                        toggleBold={toggleBold}
                        toggleItalic={toggleItalic}
                        toggleUnderline={toggleUnderline}
                        isBold={isBold}
                        isItalic={isItalic}
                        isUnderline={isUnderline}
                    />
                </div>
                <div className="px-6 py-4 space-y-4">
                    <input
                        type="text"
                        value={note.title}
                        onChange={handleTitleChange}  // Handle title change and save
                        className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-600"
                        placeholder="Enter note title"
                    />
                    <div
                        ref={editorRef}
                        contentEditable={true}
                        onInput={handleContentChange}
                        className="w-full h-64 border border-gray-300 p-4 rounded-md focus:outline-none overflow-auto"
                        dangerouslySetInnerHTML={{ __html: note.content }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
