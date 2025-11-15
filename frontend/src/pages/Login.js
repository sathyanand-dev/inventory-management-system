import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Tab,
  Tabs,
  CircularProgress,
  Divider,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setErrors({});
    setServerError('');
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (serverError) setServerError('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (serverError) setServerError('');
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'Email is required';
    if (!loginData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerData.username) newErrors.username = 'Username is required';
    if (!registerData.email) newErrors.email = 'Email is required';
    if (!registerData.password) newErrors.password = 'Password is required';
    if (registerData.password && registerData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    try {
      setLoading(true);
      setServerError('');
      await login(loginData.email, loginData.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setServerError(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    try {
      setLoading(true);
      setServerError('');
      await register(registerData.username, registerData.email, registerData.password);
      navigate('/');
    } catch (error) {
      console.error('Register error:', error);
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo/Title Section */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                mb: 2,
              }}
            >
              <InventoryIcon sx={{ fontSize: 48, color: 'white' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Inventory Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Sign in as Inventory Manager
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {/* Login Form */}
          {activeTab === 0 && (
            <form onSubmit={handleLoginSubmit}>
              {serverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {serverError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={loginData.email}
                onChange={handleLoginChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={loginData.password}
                onChange={handleLoginChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 1 && (
            <form onSubmit={handleRegisterSubmit}>
              {serverError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {serverError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={registerData.password}
                onChange={handleRegisterChange}
                error={Boolean(errors.password)}
                helperText={errors.password || 'Minimum 6 characters'}
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 2 }}>
                Role: Inventory Manager (assigned automatically)
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
