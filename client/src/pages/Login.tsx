import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, Alert, Paper, Link } from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = (location.state as any)?.message;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
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
        background: 'linear-gradient(135deg, var(--bg-gradient-3) 0%, var(--bg-gradient-2) 40%, var(--bg-gradient-3) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.13) 0%, transparent 70%)', top: -80, left: -80 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.09) 0%, transparent 70%)', bottom: -60, right: -60 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: '24px',
            background: 'rgba(var(--bg-paper-rgb), 0.85)',
            backdropFilter: 'blur(24px)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light))',
                boxShadow: '0 8px 16px rgba(var(--primary-rgb),0.3)',
                mb: 2,
              }}
            >
              <LockOpenIcon sx={{ color: 'var(--bg-paper-solid)', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight="800" color="var(--text-primary)" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your workspace
            </Typography>
          </Box>

          {successMessage && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px' }}>{successMessage}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 4 }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary-main), var(--primary-light-alt))',
                boxShadow: '0 4px 18px rgba(var(--primary-rgb),0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-main))',
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register" color="primary" fontWeight="bold">
                Register
              </Link>
            </Typography>
            <Link component={RouterLink} to="/forgot-password" color="text.secondary" variant="body2">
              Forgot password?
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;