import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaHospital,
    FaCar,
    FaIdCard,
    FaPassport,
    FaUniversity,
    FaSignOutAlt
} from "react-icons/fa";
import "./dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    /* 🔐 AUTH CHECK */
    useEffect(() => {
        const cookie = document.cookie
            .split("; ")
            .find(row => row.startsWith("user="));

        if (!cookie) {
            navigate("/login");
            return;
        }

        setUser(JSON.parse(decodeURIComponent(cookie.split("=")[1])));
    }, []);

    if (!user) return null;

    /* SERVICES */
    const services = [
        { name: "Hospital Appointment", icon: <FaHospital /> },
        { name: "RTO Services", icon: <FaCar /> },
        { name: "Aadhaar Services", icon: <FaIdCard /> },
        { name: "Passport", icon: <FaPassport /> },
        { name: "Govt Offices", icon: <FaUniversity /> }
    ];

    /* TODAY APPOINTMENTS */
    const todayAppointments = [
        {
            department: "Government Hospital",
            time: "15:30",
            remaining: "2 Hours 15 Minutes"
        }
    ];

    return (
        <div className="dashboard">

            {/* ===== HEADER ===== */}
            <header className="dashboard-header">
                <div className="logo">GovEase</div>

                <nav className="nav">
                    <span>Dashboard</span>
                    <span>Services</span>
                    <span>Appointments</span>
                </nav>

                <div className="user-area">
                    <span>{user.name}</span>
                    <FaSignOutAlt
                        className="logout"
                        onClick={() => {
                            document.cookie = "user=; Max-Age=0; path=/";
                            navigate("/login");
                        }}
                    />
                </div>
            </header>

            {/* ===== SERVICES ===== */}
            <section className="services-section">
                <h3>Government Services</h3>

                <div className="services-grid">
                    {services.map((service, i) => (
                        <div key={i} className="service-card">
                            <div className="icon">{service.icon}</div>
                            <p>{service.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== TODAY APPOINTMENTS ===== */}
            <section className="appointments-section">
                <h3>Today's Appointments</h3>

                {todayAppointments.length === 0 ? (
                    <p>No appointments today</p>
                ) : (
                    todayAppointments.map((app, i) => (
                        <div key={i} className="appointment-box">
                            <div>
                                <h4>{app.department}</h4>
                                <p>Time: {app.time}</p>
                            </div>
                            <div className="remaining">
                                ⏳ {app.remaining}
                            </div>
                        </div>
                    ))
                )}
            </section>

        </div>
    );
};

export default Dashboard;
