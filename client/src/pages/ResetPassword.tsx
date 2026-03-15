import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, Alert, Paper } from '@mui/material';

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setMessage('Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Reset failed');
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
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={4}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            background: 'rgba(var(--bg-paper-rgb), 0.8)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ height: '8px', bgcolor: 'primary.main' }} />
          <Box sx={{ p: 5 }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                Set New Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your new secure password below
              </Typography>
            </Box>

            {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {!message && (
              <form onSubmit={handleReset}>
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
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
                    borderRadius: '8px',
                  }}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
