import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import centers from "../data/centers";
import {
  loadTokens,
  serveNextToken,
  markTokenCalled,
  getPendingTokens,
} from "../services/queue";
import { logoutLocalUser } from "../services/auth";
import "./admin.css";

const Admin = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(loadTokens());
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedCenter, setSelectedCenter] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const refreshTokens = () => setTokens(loadTokens());

  const pendingTokens = useMemo(
    () => tokens.filter((token) => token.status === "pending"),
    [tokens]
  );

  const availableDepartments = useMemo(() => {
    const center = centers.find((item) => item.id === selectedCenter);
    return center?.departments || [];
  }, [selectedCenter]);

  const filteredTokens = useMemo(() => {
    return pendingTokens.filter((token) => {
      const matchesCenter = selectedCenter === "all" || token.centerId === selectedCenter;
      const matchesDepartment =
        selectedDepartment === "all" || token.department === selectedDepartment;
      return matchesCenter && matchesDepartment;
    });
  }, [pendingTokens, selectedCenter, selectedDepartment]);

  const handleServeNext = (centerId) => {
    const served = serveNextToken(centerId);
    refreshTokens();
    if (served) {
      setSelectedToken(served);
    }
  };

  const handleGenerateSlip = (token) => {
    const called = markTokenCalled(token.id);
    refreshTokens();
    setSelectedToken(called || token);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <p className="tag">Admin Panel</p>
          <h1>Manage live queues & print slips.</h1>
        </div>
        <div className="admin-actions">
          <button className="ghost" onClick={() => navigate("/home")}>
            Back to Home
          </button>
          <button
            className="ghost"
            onClick={() => {
              logoutLocalUser();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="admin-grid">
        <div className="queue-panel">
          <div className="panel-header">
            <div>
              <h2>Active tokens</h2>
              <p>{pendingTokens.length} pending requests</p>
            </div>
            <select
              value={selectedCenter}
              onChange={(event) => {
                setSelectedCenter(event.target.value);
                setSelectedDepartment("all");
              }}
            >
              <option value="all">All centers</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(event) => setSelectedDepartment(event.target.value)}
              disabled={selectedCenter === "all"}
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
                    {token.centerName} • {token.department || "General"} •{" "}
                    {token.purpose}
                  </p>
                </div>
                <div className="queue-actions">
                  <button
                    className="ghost"
                    onClick={() => handleGenerateSlip(token)}
                  >
                    Generate Slip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="admin-side">
          <div className="center-queue">
            <h3>Serve next token</h3>
            <p>Select a center to call the next token.</p>
            <div className="center-list">
              {centers.map((center) => {
                const count = getPendingTokens(center.id).length;
                return (
                  <button
                    key={center.id}
                    className="center-row"
                    onClick={() => handleServeNext(center.id)}
                  >
                    <div>
                      <strong>{center.name}</strong>
                      <span>{center.code}</span>
                    </div>
                    <span className="count">{count}</span>
                  </button>
                );
              })}
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
                  <button className="primary">Print Slip</button>
                </div>
              </div>
            ) : (
              <p className="empty">Select a token to generate a slip.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Admin;
