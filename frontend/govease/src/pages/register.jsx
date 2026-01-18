import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerLocalUser } from "../services/auth";
import "./register.css";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "user",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const user = registerLocalUser(form);
            navigate(user.role === "admin" ? "/admin" : "/home");
        } catch (err) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page login-wrapper">
            <div className="login-card">
                <h2>Create Account</h2>
                <p className="subtitle">Register to access GovEase</p>

                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile Number"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="user">User account</option>
                        <option value="admin">Admin account</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {/* ✅ LOGIN OPTION */}
                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
