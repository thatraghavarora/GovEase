import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/Home";
import Token from "./pages/Token";
import Admin from "./pages/Admin";
import { getSession } from "./services/auth";

const RequireAuth = ({ children, role }) => {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
