import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { Box, Typography, Button } from "@mui/material";
import SignIn from "./SignInWithGoogle";
import "react-toastify/dist/ReactToastify.css";
import  "../../styles/Login.css";
import { handleError, handleSuccess } from "../../utils";
import { signInSuccess } from "../../redux/userSlice";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("email and password are required");
    }
    try {
      const url = "http://localhost:8080/api/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      const { success, message, jwtToken, name, email, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("loggedInUser", name);
        
        // Create user object for Redux store
        const userData = {
          _id: result._id,
          name: name,
          username: result.username,
          email: email,
          avatar: result.avatar,
          token: jwtToken,
          isAdmin: result.isAdmin
        };
        
        // Dispatch to Redux store
        dispatch(signInSuccess(userData));
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (error) {
        const details = error?.details[0].message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } 
    
    
    
    catch (err) {
      handleError(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        px: 2
      }}
    >
      {/* Animated background */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'float 15s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-15px) rotate(90deg)' }
          }
        }}
      />

      {/* Login Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '450px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          p: 4,
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: '800',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1
            }}
          >
            Welcome Back! 👋
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: '1.1rem'
            }}
          >
            Sign in to continue building your resume
          </Typography>
        </Box>

        {/* Login Form */}
        <Box component="form" onSubmit={handleLogin} sx={{ mb: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: '600',
                color: 'text.primary',
                mb: 1,
                fontSize: '0.95rem'
              }}
            >
              Email Address
            </Typography>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '2px',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease'
                },
                '&:focus-within::before': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              <input
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginInfo.email}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '16px 0',
                  fontSize: '1rem',
                  background: 'transparent',
                  borderBottom: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#667eea';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = '#e0e0e0';
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: '600',
                color: 'text.primary',
                mb: 1,
                fontSize: '0.95rem'
              }}
            >
              Password
            </Typography>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '2px',
                  transform: 'scaleX(0)',
                  transition: 'transform 0.3s ease'
                },
                '&:focus-within::before': {
                  transform: 'scaleX(1)'
                }
              }}
            >
              <input
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={loginInfo.password}
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  padding: '16px 0',
                  fontSize: '1rem',
                  background: 'transparent',
                  borderBottom: '2px solid #e0e0e0',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = '#8999dfff';
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = '#e0e0e0';
                }}
              />
            </Box>
          </Box>

          <Button
            type="submit"
            fullWidth
            sx={{
              background: 'linear-gradient(45deg, #f9f9f9ff, #764ba2)',
              borderRadius: '12px',
              color:"black",
              py: 2,
              fontSize: '1.1rem',
              fontWeight: '600',
              textTransform: 'none',
              boxShadow: '0 8px 20px rgba(102,126,234,0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(102,126,234,0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            Sign In
          </Button>
        </Box>

        {/* Divider */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          '&::before, &::after': {
            content: '""',
            flex: 1,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)'
          }
        }}>
          <Typography
            sx={{
              px: 2,
              color: 'text.secondary',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            or continue with
          </Typography>
        </Box>

        {/* Google Sign In */}
        <Box sx={{ mb: 3 }}>
          <SignIn />
        </Box>

        {/* Signup Link */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: '0.95rem'
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#667eea',
                textDecoration: 'none',
                fontWeight: '600',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
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
