import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password },
      );
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div
      className="container-fluid vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <div
        className="card border-0 shadow-lg"
        style={{ width: "100%", maxWidth: "420px", borderRadius: "12px" }}
      >
        <div
          style={{
            height: "8px",
            backgroundColor: "var(--primary-theme)",
            borderRadius: "12px 12px 0 0",
          }}
        ></div>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "var(--primary-theme)" }}>
              Set New Password
            </h2>
            <p className="text-muted small">
              Enter your new secure password below
            </p>
          </div>

          {message ? (
            <div className="alert alert-success">{message}</div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="mb-4">
                <label className="form-label small fw-bold text-secondary">
                  NEW PASSWORD
                </label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-lg w-100 fw-bold text-white"
                style={{
                  backgroundColor: "var(--primary-theme)",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                UPDATE PASSWORD
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
