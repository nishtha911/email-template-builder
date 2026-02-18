import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
      );
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
        {/* Top Accent Bar to be made later*/}
        <div
          style={{
            height: "8px",
            backgroundColor: "var(--primary-theme)",
            borderRadius: "12px 12px 0 0",
          }}
        ></div>

        <div className="card-body p-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold" style={{ color: "var(--primary-theme)" }}>
              Portal Login
            </h2>
            <p className="text-muted small">
              Enter your credentials to continue
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="example@domain.com"
                style={{
                  fontSize: "0.9rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label small fw-bold text-secondary">
                PASSWORD
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                style={{
                  fontSize: "0.9rem",
                  borderRadius: "6px",
                  border: "1px solid #ddd",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 fw-bold text-white mt-2"
              style={{
                backgroundColor: "var(--primary-theme)",
                border: "none",
                borderRadius: "6px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "var(--primary-hover)")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "var(--primary-theme)")
              }
            >
              LOGIN
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small mb-1">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--primary-theme)",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Register Now
              </Link>
            </p>
            <Link
              to="/forgot-password"
              style={{
                color: "#666",
                fontSize: "0.8rem",
                textDecoration: "none",
              }}
            >
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
