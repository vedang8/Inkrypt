import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/Slice/LoaderSlice";
import { login, logout } from "../../redux/Slice/UserSlice";
import { message } from "antd";
import Logo from '../../images/Logo.jpg';
import "./Login.css";

const Login = () => {
    const [passShow, setPassShow] = useState(false);
    const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setVal = (e) => {
        const { name, value } = e.target;
        setInpval(() => {
          return {
            ...inpval,
            [name]: value,
          };
        });
    };

    const loginuser = async (e) => {
      e.preventDefault();
      const { email, password } = inpval;
  
      if (email === "") {
        message.error("Please enter your email");
      } else if (!email.includes("@gmail.com")) {
        message.error("Please enter a valid email");
      } else if (password === "") {
        message.error("Enter your password");
      } else if (password.length < 6) {
        message.error("Password must be at least 6 characters");
      } else {
        dispatch(setLoader(true));
        try {
          const data = await fetch("/api/user/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          const res = await data.json();
          dispatch(setLoader(false));
          //console.log(res);
          if (res.status === 201) {
            // setting the token in the localStorage
            localStorage.setItem("usersdatatoken", res.token);
            // setting the name of the user in the redux state
            dispatch(login(res.name));
            message.success("Welcome to INKRYPT");
            navigate("/home");
            setInpval({ ...inpval, email: "", password: "" });
          } else if (res.error === "User account is blocked") {
            message.error("Your account is blocked!!!");
          } else {
            message.error("Invalid Details");
          }
        } catch (error) {
          dispatch(setLoader(false));
          message.error("An error occurred. Please try again later.");
          console.error("Login error:", error);
        }
      }
    };

    return (
        <>
        <div className="login-container">
          <section>
            <div className="form_data">
              <div className="form_heading">
                <img src={Logo} alt="Image" />
                <h1>Welcome Back, Log In</h1>
              </div>
              <form>
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
                <button className="btn" onClick={loginuser}>
                  Login
                </button>
                <p>
                  Don't have an Account? <NavLink to="/register">Sign Up</NavLink>
                </p>
              </form>
            </div>
          </section>
          </div>
        </>
      );
};

export default Login;
