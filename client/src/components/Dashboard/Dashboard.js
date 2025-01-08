import React, { useState, useEffect} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { login, logout, selectUser } from "../../redux/Slice/UserSlice";
import { message } from "antd";
import { FaThumbtack } from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notes, setNotes] = useState([]);
  const user = useSelector(selectUser);

  const DashboardValid = async () => {
    dispatch(setLoader(true));
    let token = localStorage.getItem("usersdatatoken");
    try{
      const res = await fetch("/api/user/validuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const data = await res.json();
      dispatch(setLoader(false));
      if(data.status === 201){
          dispatch(login({name: data?.name, profile: data?.profile}))
      }else{
        throw new Error(data.message);
      }
    }catch(error){
      dispatch(setLoader(false));
      dispatch(logout());
      message.error(error.message);
      navigate('/login');
    }
  };

  const createNote = async () => {
    dispatch(setLoader(true));
    try{
      const res = await fetch("/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          Authorization: localStorage.getItem("usersdatatoken"),
        },
      });
      const data = await res.json();
      dispatch(setLoader(false));
      if(data.status === 201){
        message.success("New note is created successfully");
        navigate(`/note-display/${data?.noteId}`);
      }else{
        throw new Error(data.message);
      }
    }catch(error){
      dispatch(setLoader(false));
      message.error("Failed to create note");
    }
  };

  const NoteList = async () => {
    dispatch(setLoader(true));
    try{
      const res = await fetch("/api/notes/noteList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("usersdatatoken"),
          Accept: "application/json",
        },
        credentials: "include",
      });
      const data = await res.json();
      dispatch(setLoader(false));
      if(data.status === 201){
        // set notes
        setNotes(data?.note);
      }
    }catch(error){
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };
  
  const logoutUser = async () => {
    dispatch(setLoader(true));
    let token = localStorage.getItem("usersdatatoken");
    try{
      const res = await fetch("/api/user/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
          Accept: "application/json",
        },
        credentials: "include",
      });
      
      const data = await res.json();
      dispatch(setLoader(false));
      if(data.status === 201){
        localStorage.removeItem("usersdatatoken");
        dispatch(logout());
        message.success("Logged out successfully");
        navigate("/login");
      }else{
        throw new Error(data.message);
      }
    }catch(error){
      dispatch(setLoader(false));
      message.error(error.message);
      navigate("/home");
    }
  };

  const togglePinNote = async (noteId, isPinned) => {
    dispatch(setLoader(true));
    try{
      const res = await fetch("/api/notes/pinn", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("usersdatatoken"),
        },
        body: JSON.stringify({ noteId, pinned: !isPinned }),
      });
      const data = await res.json();
      dispatch(setLoader(false));
      if(data.status === 201){
        message.success("Note's state is updated successfully");
        NoteList();
      }
    }catch(error){
      dispatch(setLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    DashboardValid();
    NoteList();
  }, []);

  return (
    <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-peach-100 min-h-screen">
      <div className="sticky top-0 z-50 ">
        {/* Navbar */}
        <nav className="flex justify-between items-center p-5 bg-pink-400">
          {/* Logo Name*/}
          <div className="text-5xl font-bold">
            <h1 className="text-pink-900">INKRYPT</h1>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search..."
              className="p-3 rounded-md bg-pink-300 text-pink-800"
            />
            <div className="bg-white bg-opacity-50 py-2 px-5 rounded flex items-center gap-1">
              <img
                src={user?.profile}
                alt="Profile"
                className="rounded-full w-10 h-10 object-cover"
              />
              <span className="text-xl text-pink-900 mr-5">{user?.name}</span>
              <i
                className="ri-logout-box-r-line mr-10 cursor-pointer text-pink-800"
                onClick={() => logoutUser()}
              ></i>
            </div>
          </div>
        </nav>
        <div className="mt-4 flex justify-end space-x-4">
          {/* Create New Note Button */}
          <button
            className="flex items-center bg-pink-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-pink-600 transition duration-300"
            onClick={() => createNote()}
          >
            <span className="text-lg mr-2">+</span> Create New Note
          </button>

          {/* Meta-AI Symbol Button */}
          <button className="flex items-center mr-5 justify-center bg-gray-800 text-white w-12 h-12 rounded-full shadow-lg hover:bg-gray-700 transition duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5c2.485-1.488 5.515-1.488 8 0C23.5 7 23.5 10.992 20 12.996c-3.5 2.004-7.5 2.004-11 0C.5 10.992.5 7 4 4.5c2.485-1.488 5.515-1.488 8 0zm0 0c-2.485 1.488-5.515 1.488-8 0C.5 4.992.5 8.984 4 10.996c3.5 2.004 7.5 2.004 11 0C23.5 8.984 23.5 4.992 20 4.5c-2.485-1.488-5.515-1.488-8 0zm0 9.5c-2.485 1.488-5.515 1.488-8 0C.5 15.984.5 19.976 4 21.988c3.5 2.004 7.5 2.004 11 0 3.5-2.004 3.5-6 0-8.012-2.485-1.488-5.515-1.488-8 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes
          .sort((a, b) => b.isPinned - a.isPinned)
          .map((note, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg border border-maroon-300 transition-shadow duration-300 cursor-pointer"
              onClick={() => {navigate(`/note-display/${note?.noteId}`)}}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-blue-400">
                  {note?.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 text-lg ${
                      note?.isPinned ? "text-pink-900" : "text-gray-500"
                    } cursor-pointer`}
                    onClick={() => togglePinNote(note?.noteId, note?.isPinned)}
                  >
                    <FaThumbtack />
                  </button>
                  <button className="p-2 text-maroon-800">⋮</button>
                </div>
              </div>
              {/* Description */}
              <div>
                <p className="mt-2 text-sm text-maroon-600">
                  {" "}
                  Description: {note.description ? "No content" : "Error"}
                </p>
              </div>
              {/* Tags */}
              <div className="mt-2">
                {note.tags &&
                  note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-pink-200 text-pink-800 text-xs rounded-full px-2 py-1 mr-2"
                    >
                      {tag}
                    </span>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard