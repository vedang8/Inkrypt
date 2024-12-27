import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import './NoteDisplay.css';
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
        navigate(`/note/edit/${note?.id}`);
    };

    useEffect(() => {
        fetchNote();
    }, [noteId]);
    return (
        <div className='note-display'>
            <Toolbar onEdit={handleEditClick} onCloseNote={onCloseNote} />
            <h1>{note?.title || "Untitled"}</h1>
            <div 
                dangerouslySetInnerHTML={{ __html: note?.content || "" }} 
            />
        </div>
    )
}

export default NoteDisplay;