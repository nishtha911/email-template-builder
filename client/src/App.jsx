import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword'
import TemplateEditor from './pages/TemplateEditor';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="d-flex vh-100 justify-content-center align-items-center">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} /> 
                    <Route 
                    path="/editor" 
                    element={
                        <ProtectedRoute>
                            <TemplateEditor />
                        </ProtectedRoute>
                    } 
                />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;