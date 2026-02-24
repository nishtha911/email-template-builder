import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const focusStyle = (e) => {
    e.target.style.border = '1.5px solid #963991';
    e.target.style.boxShadow = '0 0 0 3px rgba(150,57,145,0.1)';
  };
  const blurStyle = (e) => {
    e.target.style.border = '1.5px solid rgba(150,57,145,0.18)';
    e.target.style.boxShadow = 'none';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
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
            background: success
              ? 'linear-gradient(135deg, #059669, #10b981)'
              : 'linear-gradient(135deg, #963991, #c060bb)',
            boxShadow: success
              ? '0 4px 16px rgba(5,150,105,0.3)'
              : '0 4px 16px rgba(150,57,145,0.3)',
            marginBottom: 16,
            transition: 'all 0.3s',
          }}>
            {success ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
          </div>

          {success ? (
            <>
              <h2 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                Password reset!
              </h2>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                Redirecting you to login in a moment...
              </p>
            </>
          ) : (
            <>
              <h2 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
                Reset password
              </h2>
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                Enter your new password below.
              </p>
            </>
          )}
        </div>

        {success ? (
          <div style={{
            background: 'rgba(5,150,105,0.07)',
            border: '1px solid rgba(5,150,105,0.2)',
            borderRadius: '14px', padding: '20px', textAlign: 'center',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: '#059669', fontWeight: 600 }}>
              Your password has been updated successfully.
            </p>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '10px 24px', fontSize: '0.85rem', fontWeight: 700,
                color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 4px 14px rgba(5,150,105,0.3)',
              }}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: 20,
                color: '#dc2626', fontSize: '0.85rem', textAlign: 'center',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  style={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  required
                />
              </div>
              <div style={{ marginBottom: 26 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#963991', letterSpacing: '0.8px', marginBottom: 7, textTransform: 'uppercase' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  style={inputStyle}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onFocus={focusStyle}
                  onBlur={blurStyle}
                  required
                />
                {confirm && password !== confirm && (
                  <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#dc2626' }}>
                    Passwords do not match.
                  </p>
                )}
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
                {loading ? 'Resetting...' : 'RESET PASSWORD'}
              </button>
            </form>
          </>
        )}

        {!success && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/login" style={{ color: '#963991', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>
              ← Back to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;