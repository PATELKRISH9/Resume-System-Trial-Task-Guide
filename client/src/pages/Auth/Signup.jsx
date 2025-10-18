import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignIn from "./SignInWithGoogle";
import { handleError, handleSuccess } from "../../utils";
import "../../styles/Signup.css";
import api from "../../api"; // centralized API with baseURL

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;

    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }

    try {
      // ✅ Correct backend route
      const response = await api.post("/auth/signup", signupInfo);
      const result = response.data;
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Signup failed");
      } else {
        handleError(message || "Signup failed");
      }

      console.log(result);
    } catch (err) {
      console.error(err);
      handleError(err.response?.data?.message || err.message || "Server error");
    }
  };

  return (
    <div className="Top-container">
      <div className="Signup-container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={signupInfo.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={signupInfo.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={signupInfo.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="signup-btn">
            Sign up
          </button>

          <span className="option">or</span>
          <SignIn />

          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
