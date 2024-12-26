import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { message }  from "antd"
import Logo from '../../images/Logo.jpg';

const Register = () => {
  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setcPassShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inpval, setInpval] = useState({
    fname: "",
    email: "",
    password: "",
    cpassword: "",
    profileImage: null, // Add state to store the profile image file
    imageUrl: "", // Add state to store the Cloudinary image URL
  });

  const setVal = (e) => {
    //console.log(e.target.value);
    const { name, value } = e.target;
    setInpval(() => {
      return {
        ...inpval,
        [name]: value,
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setInpval((prevState) => ({
      ...prevState,
      profileImage: file,
    }));
  };

  const uploadImageToCloudinary = async (e) => {
    e.preventDefault();
    
    const { profileImage } = inpval;
    if (!profileImage) {
      message.error("Please select an image to upload");
      return;
    }
    dispatch(setLoader(true));
    const formData = new FormData();
    formData.append("file", profileImage);
    formData.append("upload_preset", "ksd1a115"); // Replace "your_upload_preset" with your Cloudinary upload preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/drtgq0any/image/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        setInpval((prevState) => ({
          ...prevState,
          imageUrl: data.secure_url,
        }));
        dispatch(setLoader(false));
        console.log(data);
        message.success("Image uploaded successfully!");
      } else {
        message.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("An error occurred while uploading the image");
    }
  };

  const addUserdata = async (e) => {
    e.preventDefault();

    const { fname, email, password, cpassword, imageUrl } = inpval;

    if (fname === "" || email === "" || password === "" || cpassword === "" || !imageUrl) {
      message.error("Please fill in all fields and upload a profile picture");
      return;
    }

    if (!email.includes("@gmail.com")) {
      message.error("Please enter a valid email address");
      return;
    }

    if (password.length < 6 || cpassword.length < 6) {
      message.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== cpassword) {
      message.error("Password and Confirm Password must match");
      return;
    }

    dispatch(setLoader(true));

    const formData = {
      fname,
      email,
      password,
      profilePicture: imageUrl, // Pass the Cloudinary image URL to the backend
    };

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      dispatch(setLoader(false));

      if (data.status === 201) {
        message.success("Congratulations! You are registered");
        message.success("Please login with your credentials");
        setInpval({
          fname: "",
          email: "",
          password: "",
          cpassword: "",
          profileImage: null,
          imageUrl: "",
        });
        navigate("/login");
      } else {
        message.error(data.message || "An error occurred");
      }
    } catch (error) {
      dispatch(setLoader(false));
      message.error("An error occurred. Please try again later.");
    }
  };

  return (
    <>
    <div className="login-container">
      <section>
        <div className="form_data">
          <div className="form_heading">
            <img src={Logo} alt="Image" />
            <h1>Sign Up</h1>
          </div>
          <form>
            <div className="form_input">
              <label htmlFor="fname">Name</label>
              <input
                type="text"
                onChange={setVal}
                value={inpval.fname}
                name="fname"
                id="fname"
                placeholder="Enter Your Name"
              />
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                onChange={setVal}
                value={inpval.email}
                name="email"
                id="email"
                placeholder="Enter Your Email Address"
              />
            </div>
            <div className="form_input">
              <label htmlFor="password">Password</label>
              <div className="two">
                <input
                  type={!passShow ? "password" : "text"}
                  onChange={setVal}
                  value={inpval.password}
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                />
                <div
                  className="showpass"
                  onClick={() => setPassShow(!passShow)}
                >
                  {!passShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <div className="form_input">
              <label htmlFor="password">Confirm Password</label>
              <div className="two">
                <input
                  type={!cpassShow ? "password" : "text"}
                  onChange={setVal}
                  value={inpval.cpassword}
                  name="cpassword"
                  id="cpassword"
                  placeholder="Enter Your Confirm Password"
                />
                <div
                  className="showpass"
                  onClick={() => setcPassShow(!cpassShow)}
                >
                  {!cpassShow ? "Show" : "Hide"}
                </div>
              </div>
            </div>
            <div className="form_input">
                <label htmlFor="profileImage">Profile Picture</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  name="profileImage"
                  id="profileImage"
                />
                <button className="btn" onClick={uploadImageToCloudinary}>Upload Image</button>
              </div>
            <button className="btn" onClick={addUserdata}>
              Sign Up
            </button>
            <p className="para">
              Already have an Account? <NavLink to="/login">Login</NavLink>
            </p>
          </form>
        </div>
      </section>
    </div>
    </>
  );
}

export default Register;