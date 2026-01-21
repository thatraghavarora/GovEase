import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import centers from "../data/centers";
import { registerCenterAdmin } from "../services/auth";
import "./register.css";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    centerId: centers[0]?.id || "",
    centerCode: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerCenterAdmin(form);
      navigate("/admin/login");
    } catch (err) {
      setError(err.message || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page login-wrapper">
      <div className="login-card">
        <h2>Center Admin Register</h2>
        <p className="subtitle">Set your center login password</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <select
            name="centerId"
            value={form.centerId}
            onChange={handleChange}
            required
          >
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name} ({center.id})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="centerCode"
            placeholder="Center Code (e.g. JPR-RTO-101)"
            value={form.centerCode}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Set Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </form>

        <p className="login-link">
          Already registered? <Link to="/admin/login">Login</Link>
        </p>
        <p className="login-link">
          User register? <Link to="/register">User Register</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;
