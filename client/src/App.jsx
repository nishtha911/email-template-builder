import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Editor/Sidebar';
import Dashboard from './pages/Dashboard';
import TemplateList from './pages/TemplateList';
import TemplateEditor from './pages/TemplateEditor';
import Login from './pages/Login';
import Register from './pages/Register';
import { Box, CircularProgress } from '@mui/material';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#963991' }} />
      </Box>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isEditor = location.pathname.startsWith('/editor');
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {!isEditor && <Sidebar />}
      <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'auto' }}>{children}</Box>
    </Box>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress sx={{ color: '#963991' }} />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/templates"
        element={
          <ProtectedRoute>
            <MainLayout><TemplateList /></MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <MainLayout><TemplateEditor /></MainLayout>
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" replace />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;