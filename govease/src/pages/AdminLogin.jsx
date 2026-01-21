import { useState } from "react";
import { FaIdBadge, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginCenterAdmin } from "../services/auth";
import "./login.css";

const AdminLogin = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginCenterAdmin(form);
      navigate("/admin");
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-wrapper">
      <div className="login-card">
        <h2>Center Admin</h2>
        <p className="subtitle">Login to manage your center tokens</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FaIdBadge className="icon" />
            <input
              type="text"
              name="username"
              placeholder="Center ID"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="create-account">
            New center admin? <Link to="/admin/register">Register</Link>
          </p>
          <p className="create-account">
            User login? <Link to="/login">User Login</Link>
          </p>
        </form>

        <div className="footer-text">
          <span>© {new Date().getFullYear()} GovEase</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
