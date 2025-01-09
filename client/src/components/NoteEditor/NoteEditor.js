import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";
import Toolbar from "../Toolbar/Toolbar";

const NoteEditor = ({ onCloseNote }) => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [note, setNote] = useState({ title: "", content: "", tags: [] });
    const [isSaving, setIsSaving] = useState(false);

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
                dispatch(setLoader(false));
                setNote({
                    title: data.title || "",
                    content: data.content || "",
                    tags: data.tags || [],
                });
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            dispatch(setLoader(false));
            message.error("Error Fetching Note");
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            dispatch(setLoader(true));
            const res = await fetch(`/api/notes/${noteId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usersdatatoken"),
                },
                body: JSON.stringify(note),
            });
            const data = await res.json();
            if (res.status === 200) {
                dispatch(setLoader(false));
                message.success("Note updated successfully");
                navigate(`/note/${noteId}`);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            dispatch(setLoader(false));
            message.error("Error Saving Note");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (field, value) => {
        setNote(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        fetchNote();
    }, [noteId]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            {/* Main Container */}
            <div className="bg-white shadow-lg rounded-md max-w-4xl w-full p-6">
                {/* Sticky Toolbar */}
                <div className="sticky top-0 bg-white shadow-md p-4 rounded-md mb-4 flex justify-center">
                    <Toolbar
                        onCloseNote={onCloseNote}
                        onSave={handleSave}
                        isSaving={isSaving}
                    />
                </div>

                {/* Content Section */}
                <div className="px-6 py-4 space-y-4">
                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Title */}
                    <input
                        type="text"
                        value={note.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-600"
                        placeholder="Enter note title"
                    />

                    {/* Content */}
                    <textarea
                        value={note.content}
                        onChange={(e) => handleChange("content", e.target.value)}
                        className="w-full h-64 border border-gray-300 p-4 rounded-md focus:outline-none focus:border-purple-600"
                        placeholder="Write your note content here..."
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;
