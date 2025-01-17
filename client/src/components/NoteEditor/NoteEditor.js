import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";
import Toolbar from "../Toolbar/Toolbar";

const NoteEditor = () => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [note, setNote] = useState({ title: "", content: "", tags: [] });
    //const [isSaving, setIsSaving] = useState(false);
    //const contentRef = useRef(null);
    const [isEditing, setIsEditing] = useState(true);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const editorRef = useRef(null);
    
    const handleContentChange = (e) => {
        const updatedContent = e.target.innerHTML;
        setNote({ content: updatedContent });
    };

    const toggleBold = () => {
        setIsBold(!isBold);
        document.execCommand("bold");
    };

    const toggleItalic = () => {
        setIsItalic(!isItalic);
        document.execCommand("italic");
    };

    const toggleUnderline = () => {
        setIsUnderline(!isUnderline);
        document.execCommand("underline");
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

    const handleChange = (field, value) => {
        setNote((prev) => ({ ...prev, [field]: value }));
    };

    const onCloseNote = () => {
        navigate(`/home`);
    };

    useEffect(() => {
        fetchNote();
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
    }, [noteId]);
    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const parentElement = selection.getRangeAt(0).commonAncestorContainer.parentElement;

            // Check if the selected text or caret position is inside bold/italic/underline text
            // QueryCommandState will tell that is there any 
            setIsBold(document.queryCommandState("bold"));
            setIsItalic(document.queryCommandState("italic"));
            setIsUnderline(document.queryCommandState("underline"));
        };

        document.addEventListener("selectionchange", handleSelectionChange);

        return () => {
            document.removeEventListener("selectionchange", handleSelectionChange);
        };
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
            <div className="bg-white shadow-lg rounded-md max-w-4xl w-full p-6">
                <div className="sticky top-0 bg-white shadow-md p-4 rounded-md mb-4 flex justify-center">
                    <Toolbar
                        toggleBold={toggleBold}
                        toggleItalic={toggleItalic}
                        toggleUnderline={toggleUnderline}
                        onCloseNote={onCloseNote}
                        isEditing={isEditing}
                        isBold={isBold}
                        isItalic={isItalic}
                        isUnderline={isUnderline}
                    />
                </div>
                <div className="px-6 py-4 space-y-4">
                    <input
                        type="text"
                        value={note.title}
                        onChange={(e) => handleChange("title", e.target.value)}
                        className="w-full text-2xl font-bold border-b border-gray-300 pb-2 focus:outline-none focus:border-purple-600"
                        placeholder="Enter note title"
                    />
                    <div
                        ref={editorRef}
                        contentEditable={isEditing}
                        onInput={handleContentChange}
                        style={{ direction: "ltr" }}
                        className="w-full h-64 border border-gray-300 p-4 rounded-md focus:outline-none overflow-auto"
                        dangerouslySetInnerHTML={{ __html: note.content || "Start writing your note here..." }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default NoteEditor;