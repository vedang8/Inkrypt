import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message } from "antd";
import Toolbar from "../Toolbar/Toolbar";

const NoteDisplay = ({onCloseNote}) => {
    const { noteId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [note, setNote] = useState(null);

    const fetchNote = async () => {
        try{
            dispatch(setLoader(true));
            const res = await fetch(`/api/notes/${noteId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("usersdatatoken"),
                },
            });
            const data = await res.json();
            if(res.status === 201){
                dispatch(setLoader(false));
                message.success("Start Editing your note");
                setNote(data);
            }else{
                throw new Error(data.message);
            }
        }catch(error){
            dispatch(setLoader(false));
            message.error("Error Fetching Note:");
        }
    };

    const handleEditClick = () => {
        navigate(`/note/edit/${note?.noteId}`);
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
                    <Toolbar onEdit={handleEditClick} onCloseNote={onCloseNote} />
                </div>
    
                {/* Content Section */}
                <div className="px-6 py-4">
                    {/* Tags Section */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {note?.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
    
                    {/* Title */}
                    <h1
                        className={`text-2xl font-bold mb-4 border-b pb-2 text-purple-600 `}
                    >
                        {note?.title || "Untitled"}
                    </h1>
    
                    {/* Content */}
                    <div
                        className="prose prose-lg max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{
                            __html: note?.content || "No content available",
                        }}
                    />
                </div>
            </div>
        </div>
    );    
}

export default NoteDisplay;