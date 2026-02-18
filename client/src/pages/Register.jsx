import { useState } from 'react';
import { signUp } from '../api';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await signUp(formData);
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f0f0f0' }}>
            <div className="card border-0 shadow-lg" style={{ width: '100%', maxWidth: '420px', borderRadius: '12px' }}>
                <div style={{ height: '8px', backgroundColor: 'var(--primary-theme)', borderRadius: '12px 12px 0 0' }}></div>
                
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h2 className="fw-bold" style={{ color: 'var(--primary-theme)' }}>Create Account</h2>
                        <p className="text-muted small">Join our portal to get started</p>
                    </div>
                    
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">FULL NAME</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="John Doe"
                                style={{ fontSize: '0.9rem', borderRadius: '6px' }}
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">EMAIL ADDRESS</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                placeholder="example@domain.com"
                                style={{ fontSize: '0.9rem', borderRadius: '6px' }}
                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">PASSWORD</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                placeholder="Min. 6 characters"
                                style={{ fontSize: '0.9rem', borderRadius: '6px' }}
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn btn-lg w-100 fw-bold text-white mt-2" 
                            style={{ backgroundColor: 'var(--primary-theme)', border: 'none', borderRadius: '6px' }}
                        >
                            REGISTER
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="small">
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary-theme)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;