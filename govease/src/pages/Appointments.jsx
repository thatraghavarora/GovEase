import BottomNav from "../components/BottomNav";
import "./user-page.css";

const Appointments = () => {
  return (
    <div className="user-page">
      <div className="user-shell">
        <header className="user-header">
          <h1>Appointments</h1>
          <p>Track your upcoming visits</p>
        </header>
        <div className="user-card">
          No appointments scheduled yet.
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Appointments;
