import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components & Layouts
import Sidebar from "./components/Editor/Sidebar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import TemplateList from "./pages/TemplateList";
import TemplateEditor from "./pages/TemplateEditor";


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex vh-100 justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};


const DashboardLayout = ({ children }) => (
  <div className="d-flex">
    <Sidebar />
    <div className="flex-grow-1 overflow-auto vh-100 bg-light">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- Protected Routes (With Sidebar Layout) --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/templates"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TemplateList />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TemplateEditor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/editor/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <TemplateEditor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* --- Fallback Redirect --- */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;