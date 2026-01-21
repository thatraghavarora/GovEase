import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCenterById } from "../data/centers";
import { createToken, fetchQrStatus, fetchTokens } from "../services/api";
import { getSession } from "../services/auth";
import "./token.css";

const Token = () => {
  const { centerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [deptPending, setDeptPending] = useState(0);
  const [qrStatus, setQrStatus] = useState(null);
  const isQrInactive = qrStatus && !qrStatus.active;

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
    handleCreateToken();
  };

  const loadCounts = async (department) => {
    try {
      const response = await fetchTokens({
        centerId: center.id,
        status: "pending",
      });
      const tokens = response.data;
      const dept = department || form.department;
      setDeptPending(
        dept ? tokens.filter((token) => token.department === dept).length : tokens.length
      );
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load tokens");
    }
  };

  useEffect(() => {
    loadCounts(form.department);
  }, [center.id, form.department]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qrCode = params.get("qr");
    if (!qrCode) {
      setQrStatus(null);
      return;
    }

    const validateQr = async () => {
      try {
        const response = await fetchQrStatus(qrCode);
        const qr = response.data;
        if (qr.centerId !== center.id) {
          setQrStatus({ active: false, message: "QR code is for another center." });
          return;
        }
        setQrStatus({
          active: Boolean(qr.active),
          message: qr.active ? "" : "This QR code is deactivated.",
        });
      } catch (err) {
        setQrStatus({ active: false, message: "QR code not valid." });
      }
    };

    validateQr();
  }, [center.id, location.search]);

  const handleCreateToken = async () => {
    setError("");

    if (qrStatus && !qrStatus.active) {
      setError(qrStatus.message || "QR code is inactive.");
      return;
    }

    if (!form.name || !form.phone || !form.purpose || !form.department) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await createToken({
        centerId: center.id,
        name: form.name,
        phone: form.phone,
        purpose: form.purpose,
        department: form.department,
        createdBy: session?.email || null,
      });
      setCreated(response.data);
      await loadCounts(form.department);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Token failed");
    }
  };

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
          {isQrInactive && (
            <p className="error">{qrStatus.message}</p>
          )}
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
            <button className="primary" type="submit" disabled={isQrInactive}>
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
              <p className="detail-row">
                Name: <strong>{created.userName}</strong>
              </p>
              <p className="detail-row">
                Purpose: <strong>{created.purpose}</strong>
              </p>
              <p className="detail-row">
                Department: <strong>{created.department}</strong>
              </p>
              <p className="detail-note">
                Aapka number approx{" "}
                <strong>{Math.max(5, deptPending * 6)} min</strong> me aane wala
                hai.
              </p>
              <div className="summary-actions">
                <button className="ghost" onClick={() => navigate("/home")}>
                  Return Home
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
