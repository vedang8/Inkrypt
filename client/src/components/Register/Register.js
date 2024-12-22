import React from 'react'

const Register = () => {

  return (
    <>
    <div className="login-container">
      <div className="left-half">
        <img src={imageSrc} alt="Image" />
      </div>
      <div className="right-half">
      <section>
        <div className="form_data">
          <div className="form_heading">
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
    </div>
    </>
  );
}

export default Register;