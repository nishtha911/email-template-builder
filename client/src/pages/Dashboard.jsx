import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <div
              className="card-header text-white p-4"
              style={{
                backgroundColor: "var(--primary-theme)",
                borderRadius: "15px 15px 0 0",
              }}
            >
              <h3 className="mb-0">User Dashboard</h3>
            </div>
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "2rem",
                    color: "var(--primary-theme)",
                    border: "2px solid var(--primary-theme)",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ms-4">
                  <h4 className="fw-bold mb-0" style={{ color: "#333" }}>
                    {user?.name}
                  </h4>
                  <p className="text-muted mb-0">{user?.email}</p>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 mb-4">
                <p className="small text-uppercase fw-bold text-secondary mb-1">
                  Account Details
                </p>
                <p className="mb-0">
                  <strong>User ID:</strong> {user?.id}
                </p>
                <p className="mb-0">
                  <strong>Member Since:</strong>{" "}
                  {new Date(user?.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger fw-bold px-4"
                style={{ borderRadius: "8px" }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
