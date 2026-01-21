import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginLocalUser, loginWithGoogle } from "../services/auth";
import { initGoogleButton } from "../services/googleAuth";
import logo from "../assets/logo.png";

import "./login.css";

const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);
    const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (!hasGoogleClientId || !googleButtonRef.current) {
            return;
        }

        let canceled = false;

        const init = async () => {
            try {
                await initGoogleButton({
                    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    container: googleButtonRef.current,
                    onCredential: (credential) => {
                        if (canceled) {
                            return;
                        }

                        try {
                            const user = loginWithGoogle(credential);
                            navigate(user.role === "admin" ? "/admin" : "/home");
                        } catch (err) {
                            setError(err.message || "Google login failed");
                        }
                    },
                    onError: (err) => {
                        if (!canceled) {
                            setError(err.message || "Google login failed");
                        }
                    },
                });
            } catch (err) {
                if (!canceled) {
                    setError(err.message || "Google login failed");
                }
            }
        };

        init();

        return () => {
            canceled = true;
        };
    }, [hasGoogleClientId, navigate]);

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
                <img src={logo} alt="GovEase logo" className="auth-logo" />
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

                    {hasGoogleClientId && (
                        <>
                            <div className="auth-divider">
                                <span>or</span>
                            </div>
                            <div className="google-button" ref={googleButtonRef} />
                        </>
                    )}

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
