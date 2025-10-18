import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { Button, Avatar, Menu, MenuItem, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../assets/profile.png";
import { logoutUser } from "../redux/userSlice";
import { clearEducation } from "../redux/educationSlice";
import { clearProjects } from "../redux/projectSlice";
import { clearExperience } from "../redux/experienceSlice";
import { clearExtraDetails } from "../redux/extraDetailsSlice";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Navbar.css';
import { clearProfile } from "../redux/profileSlice";
import { persistor } from "../redux/store";

const Navbar = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [sectionsAnchorEl, setSectionsAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSectionsClick = (event) => {
    setSectionsAnchorEl(event.currentTarget);
  };

  const handleProfileClick = () => {
    navigate('/user-profile');
    setAnchorEl(null);
  };

  const handleContactUsClick = () => {
    navigate('/contact-us');
    setAnchorEl(null);
  };
  const handleTemplateClick = () => {
    navigate('/templates');
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSectionsAnchorEl(null);
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    navigate('/Login');
    toast.success("Logout Successful!", {
      position: "top-left",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    // Clear persisted Redux state
    await persistor.purge();
    dispatch(logoutUser());
    dispatch(clearProfile());
    dispatch(clearEducation());
    dispatch(clearProjects());
    dispatch(clearExperience());
    dispatch(clearExtraDetails());
  };
  // console.log(currentUser);
  return (
    <nav className="nav-container">
      <AppBar 
        position="fixed" 
        sx={{ 
          background: `
            linear-gradient(180deg, 
              rgba(26,35,126,0.95) 0%, 
              rgba(40,53,147,0.95) 25%, 
              rgba(63,81,181,0.95) 50%, 
              rgba(92,107,192,0.95) 75%, 
              rgba(121,134,203,0.95) 100%
            )
          `,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          color: 'white'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsDrawerOpen(true)}
            sx={{ 
              mr: 2,
              display: { xs: 'block', md: 'none' },
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: 280,
                background: `
                  linear-gradient(180deg, 
                    rgba(26,35,126,0.98) 0%, 
                    rgba(40,53,147,0.98) 25%, 
                    rgba(63,81,181,0.98) 50%, 
                    rgba(92,107,192,0.98) 75%, 
                    rgba(121,134,203,0.98) 100%
                  )
                `,
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 50px rgba(0,0,0,0.3)'
              }
            }}
          >
            {currentUser !== null ? (
              <>
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <Typography variant="h6" sx={{ 
                    fontWeight: '800',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                  }}>
                    🤖 AI Menu
                  </Typography>
                </Box>
                <List sx={{ p: 2 }}>
                  {[
                    { icon: <HomeIcon />, text: 'Home', path: '/' },
                    { icon: <EditIcon />, text: 'Edit Resume', path: '/profile' },
                    { icon: <DescriptionIcon />, text: 'Templates', path: '/templates' },
                  ].map((item, index) => (
                    <ListItem 
                      key={index}
                      button 
                      component={Link} 
                      to={item.path} 
                      onClick={handleClose}
                      sx={{
                        borderRadius: '12px',
                        mb: 1,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          transform: 'translateX(5px)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            color: 'white'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                  {currentUser?.isAdmin && (
                    <ListItem
                      button
                      component={Link}
                      to="/admin-panel"
                      onClick={handleClose}
                      sx={{
                        borderRadius: '12px',
                        mb: 1,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          transform: 'translateX(5px)',
                          boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ListItemIcon sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        <DescriptionIcon /> {/* Using DescriptionIcon for Admin Panel, can be changed */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Admin Panel"
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            color: 'white'
                          }
                        }}
                      />
                    </ListItem>
                  )}
                  <ListItem 
                    button 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: '12px',
                      mt: 2,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255,107,107,0.2)',
                        transform: 'translateX(5px)',
                        boxShadow: '0 5px 15px rgba(255,107,107,0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <ListItemIcon sx={{ color: '#FF6B6B' }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Logout"
                      sx={{ 
                        '& .MuiListItemText-primary': {
                          fontWeight: '600',
                          fontSize: '1.1rem',
                          color: '#FF6B6B'
                        }
                      }}
                    />
                  </ListItem>
                </List>
              </>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ 
                  color: 'white',
                  fontWeight: '700',
                  mb: 3,
                  fontSize: '1.3rem'
                }}>
                  🤖 AI Access Required
                </Typography>
                <Button
                  component={Link}
                  to="/Login"
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                    backgroundSize: '200% 200%',
                    borderRadius: '20px',
                    px: 4,
                    py: 2,
                    textTransform: 'none',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    animation: 'gradientShift 3s ease-in-out infinite',
                    boxShadow: '0 10px 25px rgba(255,107,107,0.4)',
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.05)',
                      boxShadow: '0 15px 35px rgba(255,107,107,0.6)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🚀 Sign In to AI
                </Button>
              </Box>
            )}
          </Drawer>

          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: '900',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4)',
              backgroundSize: '400% 400%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              animation: 'gradientShift 3s ease-in-out infinite',
              '@keyframes gradientShift': {
                '0%, 100%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' }
              }
            }}
          >
            <Link 
              to={'/'} 
              style={{ 
                textDecoration: 'none',
                color: 'inherit'
              }}
            > 
              🤖 AI RESUME BUILDER
            </Link>
          </Typography>

          {currentUser ? (
            <>
              {currentUser?.isAdmin && (
                <Button
                  component={Link}
                  to="/admin-panel"
                  sx={{
                    color: 'white',
                    fontWeight: '700',
                    textTransform: 'none',
                    mr: 2,
                    display: { xs: 'none', md: 'block' },
                    fontSize: '1rem',
                    borderRadius: '15px',
                    px: 2,
                    py: 1,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Admin Panel
                </Button>
              )}
              <Button 
                onClick={handleSectionsClick}
                sx={{
                  color: 'white',
                  fontWeight: '700',
                  textTransform: 'none',
                  mr: 2,
                  display: { xs: 'none', md: 'block' },
                  fontSize: '1rem',
                  borderRadius: '15px',
                  px: 2,
                  py: 1,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                ⚡ AI Sections
              </Button>
              <Menu
                anchorEl={sectionsAnchorEl}
                open={Boolean(sectionsAnchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    mt: 1
                  }
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {[
                  { text: 'Profile', path: '/profile' },
                  { text: 'Education', path: '/education' },
                  { text: 'Projects', path: '/projects' },
                  { text: 'Experience', path: '/experience' },
                  { text: 'Extra Details', path: '/extraDetails' }
                ].map((item, index) => (
                  <MenuItem 
                    key={index}
                    onClick={() => { navigate(item.path); handleClose(); }}
                    sx={{
                      py: 1.5,
                      px: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(102,126,234,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
              
              <Avatar
                src={currentUser?.avatar}
                alt="user"
                onClick={handleClick}
                sx={{
                  width: 45,
                  height: 45,
                  cursor: 'pointer',
                  border: '3px solid rgba(255,255,255,0.8)',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 8px 25px rgba(255,255,255,0.4)',
                    border: '3px solid white'
                  },
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    mt: 1
                  }
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {[
                  { text: 'My Profile', action: handleProfileClick },
                  { text: 'Templates', action: handleTemplateClick },
                  { text: 'Contact Us', action: handleContactUsClick },
                  { text: 'Logout', action: handleLogout, isDanger: true }
                ].map((item, index) => (
                  <MenuItem 
                    key={index}
                    onClick={item.action}
                    sx={{
                      py: 1.5,
                      px: 3,
                      color: item.isDanger ? '#FF6B6B' : 'inherit',
                      '&:hover': {
                        backgroundColor: item.isDanger ? 'rgba(255,107,107,0.1)' : 'rgba(102,126,234,0.1)'
                      }
                    }}
                  >
                    {item.text}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              component={Link}
              to="/Login"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                backgroundSize: '200% 200%',
                borderRadius: '20px',
                px: 4,
                py: 2,
                textTransform: 'none',
                fontWeight: '700',
                fontSize: '1.1rem',
                boxShadow: '0 10px 25px rgba(255,107,107,0.4)',
                animation: 'gradientShift 3s ease-in-out infinite',
                '&:hover': {
                  transform: 'translateY(-3px) scale(1.05)',
                  boxShadow: '0 15px 35px rgba(255,107,107,0.6)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}
            >
              🚀 AI Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Navbar;
