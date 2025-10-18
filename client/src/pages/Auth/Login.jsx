import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Box, Typography, Button } from "@mui/material";
import SignIn from "./SignInWithGoogle";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Login.css";
import { handleError, handleSuccess } from "../../utils";
import { signInSuccess } from "../../redux/userSlice";
import api from "../../api"; // ✅ use centralized API

function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) return handleError("Email and password are required");

    try {
      const response = await api.post("/auth/login", loginInfo);
      const result = response.data;

      const { success, message, jwtToken, name, email: userEmail, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);

        const userData = {
          _id: result._id,
          name,
          username: result.username,
          email: userEmail,
          avatar: result.avatar,
          token: jwtToken,
          isAdmin: result.isAdmin,
        };

        dispatch(signInSuccess(userData));

        setTimeout(() => navigate("/"), 1000);
      } else if (error) {
        handleError(error?.details?.[0]?.message || "Login failed");
      } else {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError(err.response?.data?.message || err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "450px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          p: 4,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "800",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Welcome Back! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.1rem" }}>
            Sign in to continue building your resume
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleLogin} sx={{ mb: 3 }}>
          <input
            type="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            placeholder="Enter your email"
            style={{
              width: "100%",
              padding: "16px 0",
              borderBottom: "2px solid #e0e0e0",
              border: "none",
              outline: "none",
              marginBottom: "16px",
            }}
          />
          <input
            type="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "16px 0",
              borderBottom: "2px solid #e0e0e0",
              border: "none",
              outline: "none",
              marginBottom: "24px",
            }}
          />

          <Button type="submit" fullWidth sx={{ py: 2, fontWeight: "600", borderRadius: "12px", background: "linear-gradient(45deg, #f9f9f9ff, #764ba2)" }}>
            Sign In
          </Button>
        </Box>

        <SignIn />

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography sx={{ color: "text.secondary", fontSize: "0.95rem" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "#667eea", fontWeight: "600" }}>
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default Login;
