import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCenterById } from "../data/centers";
import {
  createToken,
  getPendingCount,
  getPendingCountByDepartment,
} from "../services/queue";
import { getSession } from "../services/auth";
import "./token.css";

const Token = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const center = getCenterById(centerId);
  const session = getSession();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "",
    department: center?.departments?.[0] || "",
  });
  const [created, setCreated] = useState(null);
  const [error, setError] = useState("");

  if (!center) {
    return (
      <div className="token-page">
        <div className="token-card">
          <h2>Center not found</h2>
          <button className="primary" onClick={() => navigate("/home")}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.purpose || !form.department) {
      setError("Please fill in all fields.");
      return;
    }

    const token = createToken(center, {
      ...form,
      createdBy: session?.email || null,
    });
    setCreated(token);
  };

  const pendingCount = getPendingCount(center.id);
  const deptPending = form.department
    ? getPendingCountByDepartment(center.id, form.department)
    : pendingCount;

  return (
    <div className="token-page">
      <div className="token-header">
        <button className="ghost" onClick={() => navigate("/home")}>
          Back to centers
        </button>
        <div>
          <h1>{center.name}</h1>
          <p>
            {center.type} queue • {center.location} • Code {center.code}
          </p>
        </div>
      </div>

      <div className="token-grid">
        <section className="token-form">
          <h2>Generate your token</h2>
          <p className="muted">
            Fill in your details. Your token will be sent to the admin queue.
          </p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </label>
            <label>
              Department
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
              >
                {(center.departments || ["General"]).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Mobile number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit number"
              />
            </label>
            <label>
              Service / purpose
              <input
                type="text"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                placeholder="OPD consultation / License renewal"
              />
            </label>
            <button className="primary" type="submit">
              Generate Token
            </button>
          </form>
        </section>

        <aside className="token-summary">
          <div className="summary-card">
            <h3>Queue status</h3>
            <p>
              Pending tokens: <strong>{deptPending}</strong>
            </p>
            <p>
              Estimated wait: <strong>{Math.max(5, deptPending * 6)} min</strong>
            </p>
          </div>

          {created && (
            <div className="summary-card highlight">
              <h3>Your token is ready</h3>
              <div className="token-number">#{created.tokenNumber}</div>
              <p>
                Name: <strong>{created.userName}</strong>
              </p>
              <p>
                Purpose: <strong>{created.purpose}</strong>
              </p>
              <p>
                Department: <strong>{created.department}</strong>
              </p>
              <p>
                Aapka number approx{" "}
                <strong>{Math.max(5, deptPending * 6)} min</strong> me aane wala
                hai.
              </p>
              <div className="summary-actions">
                <button className="ghost" onClick={() => navigate("/home")}>
                  Return Home
                </button>
                <button className="primary" onClick={() => navigate("/admin")}>
                  View Admin
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Token;
