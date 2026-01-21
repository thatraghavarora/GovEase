import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Preloader from "./components/Preloader";
import Login from "./pages/login";
import Register from "./pages/register";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import Appointments from "./pages/Appointments";
import Tickets from "./pages/Tickets";
import Profile from "./pages/Profile";
import Scan from "./pages/Scan";
import Home from "./pages/Home";
import Token from "./pages/Token";
import Admin from "./pages/Admin";
import { getSession } from "./services/auth";

const RequireAuth = ({ children, role }) => {
  const session = getSession();

  if (!session) {
    return (
      <Navigate to={role === "admin" ? "/admin/login" : "/login"} replace />
    );
  }

  if (role && session.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Preloader />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="/appointments"
            element={
              <RequireAuth>
                <Appointments />
              </RequireAuth>
            }
          />
          <Route
            path="/scan"
            element={
              <RequireAuth>
                <Scan />
              </RequireAuth>
            }
          />
          <Route
            path="/tickets"
            element={
              <RequireAuth>
                <Tickets />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/token/:centerId"
            element={
              <RequireAuth>
                <Token />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <Admin />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
