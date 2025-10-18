import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../src/api';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, CircularProgress, Switch, FormControlLabel, TextField, InputAdornment, Tabs, Tab, Card, CardContent, Grid, Chip, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import VerifiedIcon from '@mui/icons-material/Verified';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function AdminPanel() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingAdminStatus, setUpdatingAdminStatus] = useState({});
    const [updatingVerification, setUpdatingVerification] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [resumeSearchTerm, setResumeSearchTerm] = useState('');

    useEffect(() => {
        if (!currentUser || !currentUser.isAdmin) {
            navigate('/Login'); // Redirect if not logged in or not admin
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const token = currentUser.token;
                const [usersResponse, resumesResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/admin/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${BASE_URL}/admin/resumes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                ]);
                setUsers(usersResponse.data.users);
                setFilteredUsers(usersResponse.data.users);
                setResumes(resumesResponse.data.resumes);
                setFilteredResumes(resumesResponse.data.resumes);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data.");
                toast.error("Failed to fetch data.", { position: "top-left" });
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUser, navigate]);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    useEffect(() => {
        const filtered = resumes.filter(resume =>
            resume.userId?.name?.toLowerCase().includes(resumeSearchTerm.toLowerCase()) ||
            resume.userId?.email?.toLowerCase().includes(resumeSearchTerm.toLowerCase()) ||
            resume.profile?.firstName?.toLowerCase().includes(resumeSearchTerm.toLowerCase()) ||
            resume.profile?.lastName?.toLowerCase().includes(resumeSearchTerm.toLowerCase()) ||
            resume.extraDetails?.skills?.languages?.some(skill => skill.toLowerCase().includes(resumeSearchTerm.toLowerCase())) ||
            resume.extraDetails?.skills?.web?.some(skill => skill.toLowerCase().includes(resumeSearchTerm.toLowerCase())) ||
            resume.extraDetails?.skills?.webFrameworks?.some(skill => skill.toLowerCase().includes(resumeSearchTerm.toLowerCase())) ||
            resume.extraDetails?.skills?.databases?.some(skill => skill.toLowerCase().includes(resumeSearchTerm.toLowerCase())) ||
            resume.projects?.some(project => project.title?.toLowerCase().includes(resumeSearchTerm.toLowerCase())) ||
            resume.education?.some(edu => edu.field?.toLowerCase().includes(resumeSearchTerm.toLowerCase()))
        );
        setFilteredResumes(filtered);
    }, [resumeSearchTerm, resumes]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const token = currentUser.token;
            await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter((user) => user._id !== userId));
            toast.success("User deleted successfully!", { position: "top-left" });
        } catch (err) {
            console.error("Error deleting user:", err);
            toast.error("Failed to delete user.", { position: "top-left" });
        }
    };

    const handleToggleAdminStatus = async (userId, currentAdminStatus) => {
        setUpdatingAdminStatus((prev) => ({ ...prev, [userId]: true }));
        try {
            const token = currentUser.token;
            const response = await axios.put(`${BASE_URL}/admin/users/${userId}/toggle-admin`,
                { isAdmin: !currentAdminStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUsers(users.map((user) => (user._id === userId ? response.data.user : user)));
            toast.success(response.data.message, { position: "top-left" });
        } catch (err) {
            console.error("Error toggling admin status:", err);
            toast.error("Failed to update admin status.", { position: "top-left" });
        } finally {
            setUpdatingAdminStatus((prev) => ({ ...prev, [userId]: false }));
        }
    };

    const handleToggleResumeVerification = async (resumeId, currentVerifiedStatus) => {
        setUpdatingVerification((prev) => ({ ...prev, [resumeId]: true }));
        try {
            const token = currentUser.token;
            const response = await axios.put(`${BASE_URL}/admin/resumes/${resumeId}/toggle-verification`,
                { verified: !currentVerifiedStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setResumes(resumes.map((resume) => (resume._id === resumeId ? response.data.resume : resume)));
            toast.success(response.data.message, { position: "top-left" });
        } catch (err) {
            console.error("Error toggling resume verification:", err);
            toast.error("Failed to update resume verification.", { position: "top-left" });
        } finally {
            setUpdatingVerification((prev) => ({ ...prev, [resumeId]: false }));
        }
    };

    const handleDeleteResume = async (resumeId) => {
        if (!window.confirm("Are you sure you want to delete this resume?")) {
            return;
        }

        try {
            const token = currentUser.token;
            await axios.delete(`${BASE_URL}/admin/resumes/${resumeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setResumes(resumes.filter((resume) => resume._id !== resumeId));
            toast.success("Resume deleted successfully!", { position: "top-left" });
        } catch (err) {
            console.error("Error deleting resume:", err);
            toast.error("Failed to delete resume.", { position: "top-left" });
        }
    };

    const handleViewResume = (resume) => {
        // For now, just log the resume data. In a real app, you might open a modal or navigate to a preview page
        console.log("Viewing resume:", resume);
        toast.info("Resume preview feature coming soon!", { position: "top-left" });
    };

    const handleDownloadResume = (resume) => {
        // For now, just log. In a real app, you'd generate and download a PDF
        console.log("Downloading resume:", resume);
        toast.info("Resume download feature coming soon!", { position: "top-left" });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 4
        }}>
            <Box sx={{
                maxWidth: '1200px',
                mx: 'auto',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                p: 4
            }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        textAlign: 'center',
                        mb: 4
                    }}
                >
                    🛡️ Admin Panel
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
                    <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} aria-label="admin tabs">
                        <Tab icon={<PeopleIcon />} label="Users" />
                        <Tab icon={<DescriptionIcon />} label="Resumes" />
                        <Tab icon={<AnalyticsIcon />} label="Analytics" />
                    </Tabs>
                </Box>

                {tabValue === 0 && (
                    <>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                variant="outlined"
                                placeholder="Search users by name, username, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '50px',
                                        background: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(10px)',
                                        '& fieldset': {
                                            borderColor: 'rgba(102,126,234,0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: 3
                        }}>
                            {filteredUsers.map((user) => (
                                <Box
                                    key={user._id}
                                    sx={{
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        borderRadius: '16px',
                                        p: 3,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.8)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: user.isAdmin ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'linear-gradient(45deg, #667eea, #764ba2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            color: 'white',
                                            fontSize: '1.2rem'
                                        }}>
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.username?.charAt(0).toUpperCase() || 'U'}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
                                                {user.name || user.username}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={user.isAdmin}
                                                    onChange={() => handleToggleAdminStatus(user._id, user.isAdmin)}
                                                    name="isAdmin"
                                                    color="primary"
                                                    disabled={updatingAdminStatus[user._id]}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#4ecdc4',
                                                            '& + .MuiSwitch-track': {
                                                                backgroundColor: '#4ecdc4',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                updatingAdminStatus[user._id] ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <Typography variant="body2" sx={{ fontWeight: '600', color: user.isAdmin ? '#4ecdc4' : '#667eea' }}>
                                                        {user.isAdmin ? 'Admin' : 'User'}
                                                    </Typography>
                                                )
                                            }
                                            labelPlacement="start"
                                        />

                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDeleteUser(user._id)}
                                            sx={{
                                                backgroundColor: 'rgba(255,107,107,0.1)',
                                                '&:hover': {
                                                    backgroundColor: '#ff6b6b',
                                                    color: 'white',
                                                    transform: 'scale(1.1)'
                                                },
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {tabValue === 1 && (
                    <>
                        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                            <TextField
                                variant="outlined"
                                placeholder="Search resumes by name, skills, projects..."
                                value={resumeSearchTerm}
                                onChange={(e) => setResumeSearchTerm(e.target.value)}
                                sx={{
                                    width: '100%',
                                    maxWidth: '500px',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '50px',
                                        background: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(10px)',
                                        '& fieldset': {
                                            borderColor: 'rgba(102,126,234,0.3)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#667eea',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#667eea',
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: '#667eea' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                            gap: 3
                        }}>
                            {filteredResumes.map((resume) => (
                                <Box
                                    key={resume._id}
                                    sx={{
                                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                        borderRadius: '16px',
                                        p: 3,
                                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(255,255,255,0.8)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            background: resume.verified ? 'linear-gradient(45deg, #4ecdc4, #44a08d)' : 'linear-gradient(45deg, #667eea, #764ba2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mr: 2,
                                            color: 'white',
                                            fontSize: '1.2rem'
                                        }}>
                                            {resume.userId?.name ? resume.userId.name.charAt(0).toUpperCase() : resume.userId?.email?.charAt(0).toUpperCase() || 'R'}
                                        </Box>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
                                                {resume.profile?.firstName} {resume.profile?.lastName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                {resume.userId?.email}
                                            </Typography>
                                            {resume.verified && (
                                                <Chip
                                                    icon={<VerifiedIcon />}
                                                    label="Verified"
                                                    size="small"
                                                    sx={{ mt: 1, backgroundColor: '#4ecdc4', color: 'white' }}
                                                />
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="body2" sx={{ color: '#555', mb: 1 }}>
                                            <strong>Skills:</strong> {resume.extraDetails?.skills?.languages?.join(', ') || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#555' }}>
                                            <strong>Projects:</strong> {resume.projects?.length || 0}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={resume.verified}
                                                    onChange={() => handleToggleResumeVerification(resume._id, resume.verified)}
                                                    name="verified"
                                                    color="primary"
                                                    disabled={updatingVerification[resume._id]}
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#4ecdc4',
                                                            '& + .MuiSwitch-track': {
                                                                backgroundColor: '#4ecdc4',
                                                            },
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                updatingVerification[resume._id] ? (
                                                    <CircularProgress size={20} />
                                                ) : (
                                                    <Typography variant="body2" sx={{ fontWeight: '600', color: resume.verified ? '#4ecdc4' : '#667eea' }}>
                                                        {resume.verified ? 'Verified' : 'Unverified'}
                                                    </Typography>
                                                )
                                            }
                                            labelPlacement="start"
                                        />

                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <IconButton
                                                aria-label="view"
                                                onClick={() => handleViewResume(resume)}
                                                sx={{
                                                    backgroundColor: 'rgba(102,126,234,0.1)',
                                                    '&:hover': {
                                                        backgroundColor: '#667eea',
                                                        color: 'white',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="download"
                                                onClick={() => handleDownloadResume(resume)}
                                                sx={{
                                                    backgroundColor: 'rgba(76,205,196,0.1)',
                                                    '&:hover': {
                                                        backgroundColor: '#4ecdc4',
                                                        color: 'white',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => handleDeleteResume(resume._id)}
                                                sx={{
                                                    backgroundColor: 'rgba(255,107,107,0.1)',
                                                    '&:hover': {
                                                        backgroundColor: '#ff6b6b',
                                                        color: 'white',
                                                        transform: 'scale(1.1)'
                                                    },
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {tabValue === 2 && (
                    <Box sx={{ mb: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {users.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Users
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {resumes.length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Total Resumes
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card sx={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white' }}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {resumes.filter(r => r.verified).length}
                                        </Typography>
                                        <Typography variant="body2">
                                            Verified Resumes
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
