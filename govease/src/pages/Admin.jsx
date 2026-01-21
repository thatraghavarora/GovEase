import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCenterById } from "../data/centers";
import {
  approveToken,
  clearToken,
  createAdminQrs,
  fetchAdminTokens,
  fetchAdminQrs,
  rejectToken,
  toggleAdminQr,
} from "../services/api";
import { getSession, logoutLocalUser } from "../services/auth";
import "./admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const session = getSession();
  const center = getCenterById(session?.centerId);
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrs, setQrs] = useState([]);
  const [qrCount, setQrCount] = useState(1);

  const refreshTokens = async () => {
    if (!session?.centerId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetchAdminTokens({ centerId: session.centerId });
      setTokens(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load tokens");
    } finally {
      setLoading(false);
    }
  };

  const refreshQrs = async () => {
    if (!session?.centerId) {
      return;
    }

    try {
      const response = await fetchAdminQrs({ centerId: session.centerId });
      setQrs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load QR");
    }
  };

  const pendingTokens = useMemo(
    () => tokens.filter((token) => token.status === "pending"),
    [tokens]
  );

  const availableDepartments = useMemo(() => {
    return center?.departments || [];
  }, [center]);

  const filteredTokens = useMemo(() => {
    return pendingTokens.filter((token) => {
      return (
        selectedDepartment === "all" || token.department === selectedDepartment
      );
    });
  }, [pendingTokens, selectedDepartment]);

  useEffect(() => {
    refreshTokens();
    refreshQrs();
  }, [session?.centerId]);

  const handleApprove = async (token) => {
    try {
      const response = await approveToken(token.id);
      setSelectedToken(response.data);
      await refreshTokens();
      if (window.confirm("Token approved. Print slip now?")) {
        window.print();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Approval failed");
    }
  };

  const handleReject = async (token) => {
    if (!window.confirm("Reject this token?")) {
      return;
    }

    try {
      const response = await rejectToken(token.id);
      setSelectedToken(response.data);
      await refreshTokens();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Rejection failed");
    }
  };

  const handleClear = async (token) => {
    try {
      const response = await clearToken(token.id);
      setSelectedToken(response.data);
      await refreshTokens();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Clear failed");
    }
  };

  const handleCreateQrs = async () => {
    try {
      await createAdminQrs({
        centerId: session.centerId,
        count: qrCount,
      });
      await refreshQrs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "QR create failed");
    }
  };

  const handleToggleQr = async (code) => {
    try {
      await toggleAdminQr(code);
      await refreshQrs();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "QR update failed");
    }
  };

  const todayKey = new Date().toDateString();
  const todayTokens = tokens.filter(
    (token) => new Date(token.createdAt).toDateString() === todayKey
  );
  const completedToday = todayTokens.filter((token) =>
    ["approved", "cleared"].includes(token.status)
  ).length;

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="tag">Admin Panel</p>
          <h1>{center?.name || "Center"} token approvals</h1>
          <p className="center-meta">
            {center?.type} • {center?.location} • Code {center?.code}
          </p>
        </div>
        <div className="admin-actions">
          <button
            className="ghost"
            onClick={() => {
              logoutLocalUser();
              navigate("/admin/login");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-dashboard">
        <div className="dash-card">
          <p>Total line today</p>
          <strong>{todayTokens.length}</strong>
        </div>
        <div className="dash-card">
          <p>Waiting now</p>
          <strong>{pendingTokens.length}</strong>
        </div>
        <div className="dash-card">
          <p>Completed today</p>
          <strong>{completedToday}</strong>
        </div>
      </section>

      <section className="admin-grid">
        <div className="queue-panel">
          <div className="panel-header">
            <div>
              <h2>Active tokens</h2>
              <p>{pendingTokens.length} pending requests</p>
            </div>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
            >
              <option value="all">All departments</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="queue-list">
            {error && <div className="empty">{error}</div>}
            {loading && <div className="empty">Loading tokens...</div>}
            {filteredTokens.length === 0 && (
              <div className="empty">No pending tokens right now.</div>
            )}
            {filteredTokens.map((token) => (
              <div key={token.id} className="queue-item">
                <div>
                  <span className="queue-tag">{token.centerType}</span>
                  <h3>
                    #{token.tokenNumber} · {token.userName}
                  </h3>
                  <p>
                    {token.department || "General"} • {token.purpose}
                  </p>
                </div>
                <div className="queue-actions">
                  <button
                    className="ghost"
                    onClick={() => setSelectedToken(token)}
                  >
                    Details
                  </button>
                  <button
                    className="ghost"
                    onClick={() => handleReject(token)}
                  >
                    Reject
                  </button>
                  <button
                    className="primary"
                    onClick={() => handleApprove(token)}
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="admin-side">
          <div className="stats-panel">
            <h3>Queue stats</h3>
            <div className="stats-grid">
              <div>
                <p>Pending</p>
                <strong>{pendingTokens.length}</strong>
              </div>
              <div>
                <p>Approved</p>
                <strong>
                  {tokens.filter((token) => token.status === "approved").length}
                </strong>
              </div>
              <div>
                <p>Rejected</p>
                <strong>
                  {tokens.filter((token) => token.status === "rejected").length}
                </strong>
              </div>
            </div>
          </div>

          <div className="slip-panel">
            <h3>Token slip</h3>
            {selectedToken ? (
              <div className="slip-card">
                <div className="slip-header">
                  <div>
                    <p className="slip-title">{selectedToken.centerName}</p>
                    <p className="slip-subtitle">
                      {selectedToken.centerType} • {selectedToken.centerCode}
                    </p>
                  </div>
                  <div className="slip-token">#{selectedToken.tokenNumber}</div>
                </div>
                <div className="slip-body">
                  <p>
                    Name: <strong>{selectedToken.userName}</strong>
                  </p>
                  <p>
                    Phone: <strong>{selectedToken.userPhone}</strong>
                  </p>
                  <p>
                    Purpose: <strong>{selectedToken.purpose}</strong>
                  </p>
                  <p>
                    Department:{" "}
                    <strong>{selectedToken.department || "General"}</strong>
                  </p>
                  <p>
                    Status: <strong>{selectedToken.status}</strong>
                  </p>
                </div>
                <div className="slip-footer">
                  <span>Generated {new Date().toLocaleString()}</span>
                  <div className="slip-actions">
                    <button
                      className="ghost"
                      onClick={() => window.print()}
                    >
                      Generate Slip
                    </button>
                    {["approved", "rejected"].includes(selectedToken.status) && (
                      <button
                        className="primary"
                        onClick={() => handleClear(selectedToken)}
                      >
                        Clear Token
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="empty">Select a token to generate a slip.</p>
            )}
          </div>

          <div className="qr-panel">
            <h3>QR generator</h3>
            <p>Create unique QR codes for this center.</p>
            <div className="qr-controls">
              <input
                type="number"
                min="1"
                max="50"
                value={qrCount}
                onChange={(event) => setQrCount(event.target.value)}
              />
              <button className="primary" onClick={handleCreateQrs}>
                Create QR
              </button>
            </div>
            <div className="qr-grid">
              {qrs.length === 0 && <p className="empty">No QR codes yet.</p>}
              {qrs.map((qr) => {
                const url = `${window.location.origin}/token/${center?.id}?qr=${qr.code}`;
                const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(url)}`;
                return (
                  <div key={qr.code} className="qr-card">
                    <img src={qrImg} alt="QR code" />
                    <div>
                      <p className="qr-code">{qr.code}</p>
                      <p className={`qr-status ${qr.active ? "active" : "inactive"}`}>
                        {qr.active ? "Active" : "Deactivated"}
                      </p>
                    </div>
                    <button
                      className="ghost"
                      onClick={() => handleToggleQr(qr.code)}
                    >
                      {qr.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Admin;
