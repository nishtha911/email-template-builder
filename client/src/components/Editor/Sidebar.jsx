import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: 'bi-speedometer2' },
        { name: 'My Templates', path: '/templates', icon: 'bi-folder' },
        { name: 'New Design', path: '/editor', icon: 'bi-plus-square' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-white shadow" 
             style={{ width: '250px', backgroundColor: 'var(--primary-theme)', height: '100vh' }}>
            
            <Link to="/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4 fw-bold">Builder Portal</span>
            </Link>
            <hr />
            
            <ul className="nav nav-pills flex-column mb-auto">
                {menuItems.map((item) => (
                    <li key={item.path} className="nav-item mb-2">
                        <Link 
                            to={item.path} 
                            className={`nav-link text-white d-flex align-items-center ${location.pathname === item.path ? 'active bg-white text-dark shadow-sm' : ''}`}
                            style={location.pathname === item.path ? { color: 'var(--primary-theme) !important', fontWeight: 'bold' } : {}}
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
            
            <hr />
            <div className="dropdown">
                <div className="d-flex align-items-center text-white text-decoration-none small mb-3">
                    <strong>{user?.name}</strong>
                </div>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-light w-100 fw-bold">
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;