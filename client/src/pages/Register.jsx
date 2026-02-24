import { useState } from 'react';
import { signUp } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await signUp(formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const focusStyle = (e) => {
    e.target.style.border = '1.5px solid #963991';
    e.target.style.boxShadow = '0 0 0 3px rgba(150,57,145,0.1)';
  };
  const blurStyle = (e) => {
    e.target.style.border = '1.5px solid rgba(150,57,145,0.18)';
    e.target.style.boxShadow = 'none';
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
        top: -80, right: -80, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(150,57,145,0.09) 0%, transparent 70%)',
        bottom: -60, left: -60, pointerEvents: 'none',
      }} />

      <div style={{ ...glassCard, width: '100%', maxWidth: 420, padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #963991, #c060bb)',
            boxShadow: '0 4px 16px rgba(150,57,145,0.3)',
            marginBottom: 16,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
            Create account
          </h2>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Join your workspace today</p>
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

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              style={inputStyle}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onFocus={focusStyle}
              onBlur={blurStyle}
              required
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              onFocus={focusStyle}
              onBlur={blurStyle}
              required
            />
          </div>
          <div style={{ marginBottom: 26 }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              style={inputStyle}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              onFocus={focusStyle}
              onBlur={blurStyle}
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
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#963991', fontWeight: 700, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;