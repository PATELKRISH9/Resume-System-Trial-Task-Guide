import React, { useState } from 'react';
import { app } from '../../firebase';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../../redux/userSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../../api';
import { motion } from 'framer-motion';
import { CircularProgress, Box, Button, Typography } from '@mui/material';

export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleGoogle = async () => {
        try {
            dispatch(signInStart());
            setLoading(true);
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            // console.log(result?.user);
            const formData = {
                username: result?.user?.displayName,
                email: result?.user?.email,
                avatar: result?.user?.photoURL
            };
            const response = await axios.post(`${BASE_URL}/auth/google-sign-in`, formData);
            // console.log(response?.data?.user);
            const userData = response?.data?.user;
            // Ensure all user details are included
            const completeUserData = {
                _id: userData._id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar,
                token: userData.token,
                isAdmin: userData.isAdmin
            };
            dispatch(signInSuccess(completeUserData));
            toast.success(response?.data?.message, {
                position: "top-left",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false);
            navigate('/');

        } catch (error) {
            setLoading(false);
            console.log(error);
            dispatch(signInFailure(error.message));
            toast.error("Login failed. Please try again.", {
                position: "top-left",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    return (
        <Box sx={styles.container}>
            <Button
                onClick={handleGoogle}
                sx={styles.button}
                disabled={loading}
            >
                {loading ? (
                    <CircularProgress size={24} sx={{ color: '#667eea' }} />
                ) : (
                    <>
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJKSURBVHgBvZTPaxNBFMffm93VpI2QQOqpyuhFBKFbUKmguIt6j9568z+Iihd/0YiCHgTTu2BzEKkIyUkvtRk9iUa7/gVdD2o9SFZaadP9Mc7uJtvNtlmtQr+w7OzbN595b+bNQxigtn58zEGvBIglAE4BMC/Mhhib3OWNvexDbat5mDQsamo+R+QpAboEKeIcTAUcrTC/8Hkg8JumUokoTUSg8JfquDA+yt4bvW85HtlWMARucUBTDC3x+GmrsTAro6xlxP0j4DCRHm6KTExY9nLTBxizNrKYoLLk1sW/xsh86zYkFKS8+hKozehipzWysZKHaqH57hNsUySYvEsuZ899gczJpSiyf4EFrBCAwb5kTi2BvH8F1p4cnkk66vfXx8Bz82mw5vXs6yBle05ud+vMpzPlrKMnnc/cXWlyBC0NCHyYknCEqStvR10gt2K2/4L3Ioxq6aNdVNXHpU1QF+Ey8bgef5ADi/t4jvUzPBTkTByMNrt6EKq/joA8xMvC2ldj7Eaur4C1e22KnkJ7V028DVYpWEGEDpFrd5bVABaIY+XYs/OnIU2uUhYQGn1zqRqlnNXXzBfr+6pxf+4RdnT2wlSS42/HiUcP6gQh1jzQfHUzW+tG2nWsl/JKR1rg0H/9RKlYYq966UZ3mdhFGPp6DYhTBH8/527tYX1AXxNPS9RFqZmEDpIPzXy/cvHN1UNRbyRxh7eTDdPe7Y6LVWb+BBNdyPTkH3ocFtoHKIyWlEXrUoWXChzyInJTdCQDPJxuTT5nsBP6DUkW1QHQYUIiAAAAAElFTkSuQmCC" alt="Google Logo" style={styles.icon} />
                        <Typography sx={styles.text}>Continue With Google</Typography>
                    </>
                )}
            </Button>
        </Box>
    );
}

const styles = {
    container: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '2px solid #e0e0e0',
        backgroundColor: '#fff',
        color: '#333',
        cursor: 'pointer',
        width: '100%',
        fontSize: '1rem',
        fontWeight: '600',
        textTransform: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
            borderColor: '#667eea',
            backgroundColor: '#f8f9ff',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
        '&:disabled': {
            opacity: 0.7,
            cursor: 'not-allowed',
        }
    },
    text: {
        fontSize: '1rem',
        fontWeight: '600',
        margin: '0',
        color: '#333',
        marginLeft: '12px',
    },
    icon: {
        width: '20px',
        height: '20px',
    },
};
