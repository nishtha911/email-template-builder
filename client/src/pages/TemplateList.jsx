import { useEffect, useState } from "react";
import { fetchTemplates } from "../api";
import { useNavigate, Link } from "react-router-dom";

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const { data } = await fetchTemplates();
        setTemplates(data);
      } catch (err) {
        console.error("Failed to load templates", err);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  return (
    <div className="container mt-5" style={{ fontFamily: "Poppins" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{ color: "var(--primary-theme)" }}>
          My Templates
        </h2>
        <button
          onClick={() => navigate("/editor")}
          className="btn text-white fw-bold shadow-sm"
          style={{
            backgroundColor: "var(--primary-theme)",
            borderRadius: "8px",
          }}
        >
          + Create New
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <div
            className="spinner-border"
            style={{ color: "var(--primary-theme)" }}
            role="status"
          ></div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center bg-white p-5 shadow-sm rounded-4 mt-5">
          <p className="text-muted">
            No templates found. Start building your first email!
          </p>
        </div>
      ) : (
        <div className="row">
          {templates.map((temp) => (
            <div key={temp.id} className="col-md-4 mb-4">
              <div
                className="card border-0 shadow-sm h-100"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-2">{temp.name}</h5>
                  <p className="small text-muted mb-4">
                    Saved on: {new Date(temp.created_at).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-outline-secondary btn-sm w-100 fw-bold"
                    style={{ borderRadius: "6px" }}
                    onClick={() => alert("Load logic coming soon!")}
                  >
                    Edit Template
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;
