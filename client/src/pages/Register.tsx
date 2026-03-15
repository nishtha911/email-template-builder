import React, { useState } from 'react';
import { signUp } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Alert, Paper, Link } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {  } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(formData);
      // Removed auto-login
      navigate('/login', { state: { message: 'Registration successful. Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
      <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.13) 0%, transparent 70%)', top: -80, right: -80 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(var(--primary-rgb),0.09) 0%, transparent 70%)', bottom: -60, left: -60 }} />

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
              <PersonAddIcon sx={{ color: 'var(--bg-paper-solid)', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight="800" color="var(--text-primary)" gutterBottom>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join your workspace today
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <Box textAlign="center" mt={3}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login" color="primary" fontWeight="bold">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;