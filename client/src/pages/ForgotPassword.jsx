import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgot = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setMessage("Check your terminal (Mock Email) for the reset link.");
        } catch (err) {
            alert(err.response?.data?.message || "Error sending request");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--primary-theme)', borderRadius: '12px 12px 0 0' }}></div>
                
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: 'var(--primary-theme)' }}>Reset Password</h2>
                        <p className="text-muted small">Enter your email to receive a reset link</p>
                    </div>
                    
                    {message ? (
                        <div className="alert alert-success small">{message}</div>
                    ) : (
                        <form onSubmit={handleForgot}>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">EMAIL ADDRESS</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    placeholder="example@domain.com"
                                    style={{ fontSize: '0.9rem', borderRadius: '6px' }}
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="btn btn-lg w-100 fw-bold text-white" 
                                style={{ backgroundColor: 'var(--primary-theme)', border: 'none', borderRadius: '6px' }}
                            >
                                SEND LINK
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-4">
                        <Link to="/login" style={{ color: 'var(--primary-theme)', fontWeight: '600', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;