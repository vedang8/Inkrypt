import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from '../../images/Logo.jpg';
import "./Login.css";

const Login = () => {
    const [passShow, setPassShow] = useState(false);
    const [inpval, setInpval] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const setVal = (e) => {
        const { name, value } = e.target;
        setInpval(() => {
          return {
            ...inpval,
            [name]: value,
          };
        });
    };

    const loginuser = () => {

    }
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
