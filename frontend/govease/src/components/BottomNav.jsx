import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaQrcode,
  FaTicketAlt,
  FaUserCircle,
} from "react-icons/fa";
import "./bottom-nav.css";

const BottomNav = () => {
  const navClass = (extra = "") =>
    ({ isActive }) =>
      `nav-item${extra ? ` ${extra}` : ""}${isActive ? " active" : ""}`;

  return (
    <footer className="bottom-nav-wrap">
      <nav className="bottom-nav">
        <NavLink to="/home" className={navClass()}>
          <FaHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/appointments" className={navClass()}>
          <FaCalendarAlt />
          <span>Appointments</span>
        </NavLink>
        <NavLink to="/scan" className={navClass("nav-scan")}>
          <FaQrcode />
          <span>Scan</span>
        </NavLink>
        <NavLink to="/tickets" className={navClass()}>
          <FaTicketAlt />
          <span>Tickets</span>
        </NavLink>
        <NavLink to="/profile" className={navClass()}>
          <FaUserCircle />
          <span>Profile</span>
        </NavLink>
      </nav>
    </footer>
  );
};

export default BottomNav;
