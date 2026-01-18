import { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginLocalUser } from "../services/auth";

import "./login.css";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = loginLocalUser(form);
            navigate(user.role === "admin" ? "/admin" : "/home");
        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="auth-page login-wrapper">
            <div className="login-card">
                <h2>GovEase</h2>
                <p className="subtitle">Secure Government Access Portal</p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <FaEnvelope className="icon" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
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
                        Don’t have an account?{" "}
                        <Link to="/register">Create Account</Link>
                    </p>

                </form>

                <div className="footer-text">
                    <span>© {new Date().getFullYear()} GovEase</span>
                </div>
            </div>
        </div>
    );
};

export default Login;
