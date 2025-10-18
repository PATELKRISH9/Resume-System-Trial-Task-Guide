import React, { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { useDispatch, useSelector } from "react-redux";
import { updateEducation } from "../redux/educationSlice";
import { updateProfile } from "../redux/profileSlice";
import { updateProject } from "../redux/projectSlice";
import { updateExperience } from "../redux/experienceSlice";
import axios from "axios";
import { BASE_URL } from "../api";
import {
  updateAchievements,
  updateExtraCoCurricular,
  updateSkills,
} from "../redux/extraDetailsSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff6f61",
    },
    background: {
      default: "#ffecd6",
    },
    text: {
      primary: "#333333",
      secondary: "#555555",
    },
  },
});

export default function LandingPage() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAllResumeData = async () => {
    // console.log('entered');
    try {
      const response = await axios.get(
        `${BASE_URL}/data/get-all-resume-data?id=${currentUser._id}`,
        {
          headers: {
            authorization: currentUser.token,
          },
        }
      );
      // console.log("response: ", response.data.resumeData[0]);
      const resumeData = response.data.resumeData[0];
      // console.log('Education:', resumeData.education[0])
      if (resumeData) {
        dispatch(updateProfile(resumeData.profile));
        dispatch(updateEducation(resumeData.education[0]));
        resumeData.projects.forEach((project, index) => {
          Object.keys(project).forEach((field) => {
            dispatch(updateProject({ index, field, value: project[field] }));
          });
        });

        // Assuming resumeData.experience is an array
        resumeData.experience.forEach((experience, index) => {
          Object.keys(experience).forEach((field) => {
            dispatch(
              updateExperience({ index, field, value: experience[field] })
            );
          });
        });
        const { skills, achievements, extraCoCurricular } =
          resumeData.extraDetails;
        // Update skills
        // console.log(skills);
        Object.keys(skills).forEach((type) => {
          skills[type].forEach((skill, index) => {
            dispatch(updateSkills({ type, index, value: skill }));
          });
        });

        // Update achievements
        achievements.forEach((achievement, index) => {
          dispatch(updateAchievements({ index, value: achievement }));
        });

        // Update extra co-curricular activities
        extraCoCurricular.forEach((activity, index) => {
          dispatch(updateExtraCoCurricular({ index, value: activity }));
        });
      }
    } catch (error) {
      console.error("Error in getAllResumeData:", error);
    }
  };

  useEffect(() => {
    getAllResumeData();
  }, []);

  const handleGetStarted = () => {
    navigate("/Login");
  };

  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: `
            linear-gradient(180deg, 
              #1a237e 0%, 
              #283593 25%, 
              #3f51b5 50%, 
              #5c6bc0 75%, 
              #7986cb 100%
            )
          `,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* AI-Powered Animated Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(63,81,181,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(92,107,192,0.4) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(121,134,203,0.3) 0%, transparent 50%)
            `,
            animation: 'aiFloat 15s ease-in-out infinite',
            '@keyframes aiFloat': {
              '0%, 100%': { transform: 'translateY(0px) scale(1) rotate(0deg)' },
              '25%': { transform: 'translateY(-10px) scale(1.05) rotate(1deg)' },
              '50%': { transform: 'translateY(-20px) scale(1.1) rotate(0deg)' },
              '75%': { transform: 'translateY(-10px) scale(1.05) rotate(-1deg)' }
            }
          }}
        />
        
        {/* AI Neural Network Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'neuralPulse 8s ease-in-out infinite',
            '@keyframes neuralPulse': {
              '0%, 100%': { opacity: 0.3 },
              '50%': { opacity: 0.6 }
            }
          }}
        />
        
        {/* Floating AI Particles */}
        {[...Array(20)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `hsl(${Math.random() * 30 + 230}, 65%, 65%)`,
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `particleFloat ${Math.random() * 10 + 10}s linear infinite`,
              '@keyframes particleFloat': {
                '0%': { 
                  transform: 'translateY(0px) translateX(0px)',
                  opacity: 0
                },
                '10%': { opacity: 1 },
                '90%': { opacity: 1 },
                '100%': { 
                  transform: `translateY(-${Math.random() * 200 + 100}px) translateX(${Math.random() * 100 - 50}px)`,
                  opacity: 0
                }
              },
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            minHeight: '100vh',
            py: 8,
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 4, lg: 0 }
          }}>
            <Box sx={{ flex: 1, pr: { xs: 0, md: 6 } }}>
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: '900',
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                    color: 'white',
                    mb: 3,
                    lineHeight: 1.1,
                    textShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, rgba(255,255,255,0.1), transparent)',
                      borderRadius: '20px',
                      filter: 'blur(20px)',
                      zIndex: -1
                    }
                  }}
                >
                  <Box component="span" sx={{ 
                    display: 'block',
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)',
                    backgroundSize: '400% 400%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradientShift 3s ease-in-out infinite',
                    '@keyframes gradientShift': {
                      '0%, 100%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' }
                    }
                  }}>
                    AI-Powered
                  </Box>
                  <Box component="span" sx={{ 
                    color: 'white',
                    display: 'block',
                    textShadow: '0 0 30px rgba(255,255,255,0.5)'
                  }}>
                    Resume Builder
                  </Box>
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: 4,
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.7,
                    maxWidth: '700px',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                    position: 'relative',
                    '&::before': {
                      content: '"🤖"',
                      position: 'absolute',
                      left: '-40px',
                      top: '0',
                      fontSize: '2rem',
                      animation: 'aiPulse 2s ease-in-out infinite',
                      '@keyframes aiPulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.2)' }
                      }
                    }
                  }}
                >
                  <Box component="span" sx={{
                    background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700'
                  }}>
                    Revolutionary AI technology
                  </Box> analyzes your experience and creates stunning, 
                  ATS-optimized resumes that land you interviews. 
                  <Box component="span" sx={{
                    background: 'linear-gradient(45deg, #45B7D1, #96CEB4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '700'
                  }}>
                    Build in 60 seconds, get hired faster.
                  </Box>
                </Typography>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <Button
                    onClick={handleGetStarted}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                      backgroundSize: '200% 200%',
                      borderRadius: '60px',
                      px: 5,
                      py: 3,
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textTransform: 'none',
                      boxShadow: '0 20px 40px rgba(255,107,107,0.4), 0 0 0 1px rgba(255,255,255,0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'gradientShift 3s ease-in-out infinite',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.5s ease'
                      },
                      '&:hover': {
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: '0 25px 50px rgba(255,107,107,0.6), 0 0 0 1px rgba(255,255,255,0.4)',
                        '&::before': {
                          left: '100%'
                        }
                      },
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    size="large"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        fontSize: '1.5rem',
                        animation: 'rocketBoost 1.5s ease-in-out infinite',
                        '@keyframes rocketBoost': {
                          '0%, 100%': { transform: 'translateX(0px)' },
                          '50%': { transform: 'translateX(5px)' }
                        }
                      }}>
                        🚀
                      </Box>
                      <Box>
                        <Box sx={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>Start Building</Box>
                        <Box sx={{ display: 'block', fontWeight: '800' }}>FREE NOW</Box>
                      </Box>
                    </Box>
                  </Button>
                  
                  <Button
                    variant="outlined"
                    sx={{
                      border: '2px solid rgba(255,255,255,0.6)',
                      color: 'white',
                      borderRadius: '60px',
                      px: 5,
                      py: 3,
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textTransform: 'none',
                      background: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,1)',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        transform: 'translateY(-4px) scale(1.05)',
                        boxShadow: '0 20px 40px rgba(255,255,255,0.2)',
                        '&::before': {
                          opacity: 1
                        }
                      },
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    size="large"
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ 
                        fontSize: '1.5rem',
                        animation: 'templateSpin 2s linear infinite',
                        '@keyframes templateSpin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }}>
                        📖
                      </Box>
                      <Box>
                        <Box sx={{ display: 'block', fontSize: '0.9rem', opacity: 0.9 }}>Explore</Box>
                        <Box sx={{ display: 'block', fontWeight: '800' }}>TEMPLATES</Box>
                      </Box>
                    </Box>
                  </Button>
                </Box>
              </motion.div>

              {/* AI-Powered Feature highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: 3, 
                  mt: 8,
                  p: 3,
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                  {[
                    { icon: '🤖', text: 'AI-Powered', subtext: 'Smart suggestions' },
                    { icon: '⚡', text: '60 Second Build', subtext: 'Ultra fast' },
                    { icon: '🎨', text: 'Premium Templates', subtext: 'Award winning' },
                    { icon: '📈', text: 'ATS Optimized', subtext: 'Get interviews' }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 1,
                          p: 3,
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-5px)',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)'
                          }
                        }}
                      >
                        <Typography sx={{ 
                          fontSize: '2.5rem',
                          animation: 'featureFloat 3s ease-in-out infinite',
                          animationDelay: `${index * 0.5}s`,
                          '@keyframes featureFloat': {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-10px)' }
                          }
                        }}>
                          {feature.icon}
                        </Typography>
                        <Typography sx={{ 
                          color: 'white',
                          fontWeight: '700',
                          fontSize: '1.1rem',
                          textAlign: 'center'
                        }}>
                          {feature.text}
                        </Typography>
                        <Typography sx={{ 
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: '0.9rem',
                          textAlign: 'center'
                        }}>
                          {feature.subtext}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </motion.div>
            </Box>

            {/* Right side - INCREDIBLE AI Selection Interface */}
            <Box sx={{ 
              flex: 1, 
              display: { xs: 'flex', sm: 'flex', md: 'flex', lg: 'flex' },
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: { xs: '500px', md: '700px' }
            }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: { xs: '500px', md: '700px' },
                    background: `
                      linear-gradient(135deg, 
                        rgba(26,35,126,0.9) 0%, 
                        rgba(40,53,147,0.8) 25%, 
                        rgba(63,81,181,0.7) 50%, 
                        rgba(92,107,192,0.8) 75%, 
                        rgba(121,134,203,0.9) 100%
                      )
                    `,
                    borderRadius: '40px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    backdropFilter: 'blur(30px)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                    p: 4
                  }}
                >
                  {/* AI Selection Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    <Typography
                      sx={{
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        fontWeight: '900',
                        color: 'white',
                        textAlign: 'center',
                        textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                        mb: 2
                      }}
                    >
                      🤖 AI RESUME SELECTION
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '1rem', md: '1.2rem' },
                        color: 'rgba(255,255,255,0.9)',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    >
                      Choose Your AI-Powered Resume Style
                    </Typography>
                  </motion.div>

                  {/* AI Selection Cards */}
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                    gap: 3,
                    width: '100%',
                    maxWidth: '600px',
                    my: 3
                  }}>
                    {[
                      { 
                        title: 'Professional AI', 
                        icon: '👔', 
                        desc: 'Corporate Excellence',
                        gradient: 'linear-gradient(45deg, #3f51b5, #5c6bc0)',
                        features: ['ATS Optimized', 'Industry Keywords', 'Professional Format']
                      },
                      { 
                        title: 'Creative AI', 
                        icon: '🎨', 
                        desc: 'Design Innovation',
                        gradient: 'linear-gradient(45deg, #5c6bc0, #7986cb)',
                        features: ['Visual Impact', 'Creative Layout', 'Portfolio Integration']
                      },
                      { 
                        title: 'Tech AI', 
                        icon: '💻', 
                        desc: 'Technical Mastery',
                        gradient: 'linear-gradient(45deg, #7986cb, #9fa8da)',
                        features: ['Code Integration', 'Tech Stack', 'Project Showcase']
                      },
                      { 
                        title: 'Executive AI', 
                        icon: '👑', 
                        desc: 'Leadership Focus',
                        gradient: 'linear-gradient(45deg, #9fa8da, #c5cae9)',
                        features: ['Strategic Vision', 'Leadership Metrics', 'Executive Summary']
                      }
                    ].map((option, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                      >
                        <Box
                          sx={{
                            background: option.gradient,
                            borderRadius: '20px',
                            p: 3,
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            border: '2px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            '&:hover': {
                              transform: 'translateY(-10px) scale(1.05)',
                              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
                              border: '2px solid rgba(255,255,255,0.5)'
                            },
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                              transition: 'left 0.5s ease'
                            },
                            '&:hover::before': {
                              left: '100%'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontSize: '2.5rem', mr: 2 }}>
                              {option.icon}
                            </Typography>
                            <Box>
                              <Typography sx={{
                                color: 'white',
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                mb: 0.5
                              }}>
                                {option.title}
                              </Typography>
                              <Typography sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                              }}>
                                {option.desc}
                              </Typography>
                            </Box>
                          </Box>
                          <Box>
                            {option.features.map((feature, idx) => (
                              <Typography key={idx} sx={{
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '0.8rem',
                                mb: 0.5,
                                '&::before': {
                                  content: '"✓ "',
                                  color: 'rgba(255,255,255,0.9)',
                                  fontWeight: 'bold'
                                }
                              }}>
                                {feature}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* AI Selection Footer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                  >
                    <Button
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1)',
                        backgroundSize: '200% 200%',
                        borderRadius: '30px',
                        px: 6,
                        py: 2,
                        fontSize: '1.2rem',
                        fontWeight: '800',
                        textTransform: 'none',
                        color: 'white',
                        boxShadow: '0 15px 35px rgba(255,107,107,0.4)',
                        animation: 'gradientShift 3s ease-in-out infinite',
                        '&:hover': {
                          transform: 'translateY(-3px) scale(1.05)',
                          boxShadow: '0 20px 45px rgba(255,107,107,0.6)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }}
                    >
                      🚀 START AI BUILDING
                    </Button>
                  </motion.div>

                  {/* Floating AI Elements */}
                  {[...Array(8)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: 'absolute',
                        width: `${Math.random() * 6 + 3}px`,
                        height: `${Math.random() * 6 + 3}px`,
                        background: `rgba(255,255,255,${Math.random() * 0.5 + 0.3})`,
                        borderRadius: '50%',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float${i} ${Math.random() * 8 + 6}s ease-in-out infinite`,
                        [`@keyframes float${i}`]: {
                          '0%, 100%': { 
                            transform: 'translateY(0px) translateX(0px)',
                            opacity: 0.3
                          },
                          '50%': { 
                            transform: `translateY(-${Math.random() * 30 + 10}px) translateX(${Math.random() * 20 - 10}px)`,
                            opacity: 0.8
                          }
                        },
                        animationDelay: `${Math.random() * 3}s`
                      }}
                    />
                  ))}
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
  
}
