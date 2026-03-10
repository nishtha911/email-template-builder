import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, Alert, Paper, Link } from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
        background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 40%, #ede9fe 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,57,145,0.13) 0%, transparent 70%)', top: -80, left: -80 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,57,145,0.09) 0%, transparent 70%)', bottom: -60, right: -60 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
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
                background: 'linear-gradient(135deg, #963991, #c060bb)',
                boxShadow: '0 8px 16px rgba(150,57,145,0.3)',
                mb: 2,
              }}
            >
              <LockResetIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>

            {!sent ? (
              <>
                <Typography variant="h5" fontWeight="800" color="#1a1a2e" gutterBottom>
                  Forgot Password?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter your email to receive a reset link.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h5" fontWeight="800" color="#1a1a2e" gutterBottom>
                  Check Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We've sent a link to <Box component="span" fontWeight="bold" color="primary.main">{email}</Box>
                </Typography>
              </>
            )}
          </Box>

          {!sent ? (
            <>
              {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    background: 'linear-gradient(135deg, #963991, #b84db3)',
                    boxShadow: '0 4px 18px rgba(150,57,145,0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #7a2d75, #963991)',
                    }
                  }}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <Alert severity="info" sx={{ borderRadius: '12px', mb: 3 }}>
              A password reset link has been sent to your email. The link expires in 1 hour.
            </Alert>
          )}

          <Box textAlign="center" mt={3}>
            <Link component={RouterLink} to="/login" color="text.secondary" variant="body2" fontWeight="medium">
              &larr; Back to login
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;