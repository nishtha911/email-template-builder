import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const glassCard = {
  background: 'rgba(255, 255, 255, 0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.7)',
  boxShadow: '0 8px 40px rgba(150, 57, 145, 0.12), 0 1.5px 8px rgba(0,0,0,0.07)',
};

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  fontSize: '0.93rem',
  borderRadius: '12px',
  border: '1.5px solid rgba(150, 57, 145, 0.18)',
  background: 'rgba(255,255,255,0.7)',
  outline: 'none',
  transition: 'border 0.2s, box-shadow 0.2s',
  fontFamily: 'inherit',
  color: '#2d2d2d',
  boxSizing: 'border-box',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf4ff 40%, #ede9fe 100%)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(150,57,145,0.13) 0%, transparent 70%)',
        top: -80, left: -80, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(150,57,145,0.09) 0%, transparent 70%)',
        bottom: -60, right: -60, pointerEvents: 'none',
      }} />

      <div style={{ ...glassCard, width: '100%', maxWidth: 420, padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #963991, #c060bb)',
            boxShadow: '0 4px 16px rgba(150,57,145,0.3)',
            marginBottom: 16,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="m22 7-10 7L2 7" />
            </svg>
          </div>
          <h2 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            Welcome back
          </h2>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Sign in to your workspace</p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: 20,
            color: '#dc2626', fontSize: '0.85rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={(e) => { e.target.style.border = '1.5px solid #963991'; e.target.style.boxShadow = '0 0 0 3px rgba(150,57,145,0.1)'; }}
              onBlur={(e) => { e.target.style.border = '1.5px solid rgba(150,57,145,0.18)'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={(e) => { e.target.style.border = '1.5px solid #963991'; e.target.style.boxShadow = '0 0 0 3px rgba(150,57,145,0.1)'; }}
              onBlur={(e) => { e.target.style.border = '1.5px solid rgba(150,57,145,0.18)'; e.target.style.boxShadow = 'none'; }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', fontSize: '0.92rem', fontWeight: 700,
              color: 'white', border: 'none', borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#c097be' : 'linear-gradient(135deg, #963991, #b84db3)',
              boxShadow: loading ? 'none' : '0 4px 18px rgba(150,57,145,0.35)',
              transition: 'all 0.2s', letterSpacing: '0.5px',
            }}
            onMouseOver={(e) => { if (!loading) e.target.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}
          >
            {loading ? 'Signing in...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#666' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#963991', fontWeight: 700, textDecoration: 'none' }}>
              Register
            </Link>
          </p>
          <Link to="/forgot-password" style={{ color: '#aaa', fontSize: '0.8rem', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;