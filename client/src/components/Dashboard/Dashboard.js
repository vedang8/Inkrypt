import React, { useState, useEffect} from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { logout } from "../../redux/Slice/UserSlice";
import { message } from "antd";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const notes = useState([]);

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
          navigate("/home");
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

  useEffect(() => {
    DashboardValid();
  }, []);
  
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

  return (
    <div className="bg-gradient-to-r from-pink-300 via-pink-200 to-peach-100 min-h-screen">
  {/* Navbar */}
  <nav className="flex justify-between items-center p-4 bg-pink-400">
    <div className="text-5xl font-bold"><h1 className='text-pink-900'>INKRYPT</h1></div>
    <div className="flex items-center space-x-4">
      <input type="text" placeholder="Search..." className="p-3 rounded-md bg-pink-300 text-pink-800" />
      <div className="flex items-center space-x-2">
        <img src="https://via.placeholder.com/40" alt="Profile" className="rounded-full w-10 h-10" />
        <span className="text-sm">John Doe</span>
        <i className="ri-logout-box-r-line ml-2 cursor-pointer"
          onClick={()=> logoutUser()}
          ></i>
      </div>
    </div>
  </nav>

  {/* Dashboard Content */}
  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {notes.map((note, index) => (
      <div
        key={index}
        className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg border border-maroon-300 transition-shadow duration-300"
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-maroon-800">{note.title}</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full bg-pink-200 hover:bg-maroon-300 text-maroon-800">
              📌
            </button>
            <button className="p-2 rounded-full bg-pink-200 hover:bg-maroon-300 text-maroon-800">
              ⋮
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

  )
}

export default Dashboard