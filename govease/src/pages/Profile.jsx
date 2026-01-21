import BottomNav from "../components/BottomNav";
import { getSession, logoutLocalUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "./user-page.css";

const Profile = () => {
  const navigate = useNavigate();
  const session = getSession();
  const initials = (session?.name || "User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="user-page">
      <div className="user-shell">
        <header className="user-header">
          <h1>Profile</h1>
          <p>Manage your account details</p>
        </header>
        <div className="profile-card">
          <div className="profile-meta">GovEase User</div>
          <div className="profile-name">
            {initials} · {session?.name || "User"}
          </div>
          <div className="profile-meta">{session?.email || "Not set"}</div>
          <div className="profile-actions">
            <button
              className="ghost"
              type="button"
              onClick={() => navigate("/home")}
            >
              Back to Home
            </button>
            <button
              className="ghost"
              type="button"
              onClick={() => {
                logoutLocalUser();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="profile-grid">
          <div className="profile-item">
            <span>Role</span>
            <strong>{session?.role || "user"}</strong>
          </div>
          <div className="profile-item">
            <span>Email</span>
            <strong>{session?.email || "Not set"}</strong>
          </div>
          <div className="profile-item">
            <span>Account status</span>
            <strong>Active</strong>
          </div>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Profile;
