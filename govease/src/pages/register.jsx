import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithGoogle, registerLocalUser } from "../services/auth";
import { initGoogleButton } from "../services/googleAuth";
import logo from "../assets/logo.png";
import "./register.css";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const googleButtonRef = useRef(null);
    const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

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
                            setError(err.message || "Google registration failed");
                        }
                    },
                    onError: (err) => {
                        if (!canceled) {
                            setError(err.message || "Google registration failed");
                        }
                    },
                });
            } catch (err) {
                if (!canceled) {
                    setError(err.message || "Google registration failed");
                }
            }
        };

        init();

        return () => {
            canceled = true;
        };
    }, [hasGoogleClientId, navigate]);

    return (
        <div className="auth-page login-wrapper">
            <div className="login-card">
                <img src={logo} alt="GovEase logo" className="auth-logo" />
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

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                    {hasGoogleClientId && (
                        <>
                            <div className="auth-divider">
                                <span>or</span>
                            </div>
                            <div className="google-button" ref={googleButtonRef} />
                        </>
                    )}
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
