import { useCallback, useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import { fetchTokens } from "../services/api";
import { getSession } from "../services/auth";
import "./user-page.css";

const Tickets = () => {
  const session = getSession();
  const [tickets, setTickets] = useState([]);
  const [printTicket, setPrintTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTickets = async () => {
      if (!session?.email) {
        setTickets([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetchTokens({ createdBy: session.email });
        setTickets(response.data.slice().reverse());
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load tickets");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, [session?.email]);

  const getEta = useCallback(async (ticket) => {
    if (ticket.status !== "pending") {
      return null;
    }

    try {
      const response = await fetchTokens({
        centerId: ticket.centerId,
        status: "pending",
      });
      const pending = response.data.filter(
        (token) =>
          token.department === ticket.department &&
          token.tokenNumber < ticket.tokenNumber
      );
      return Math.max(5, pending.length * 6);
    } catch (err) {
      return null;
    }
  }, []);

  return (
    <div className="user-page">
      <div className="user-shell">
        <header className="user-header">
          <h1>Tickets</h1>
          <p>Your latest token history</p>
        </header>
        <div className="ticket-list">
          {loading && <div className="user-card">Loading tickets...</div>}
          {error && <div className="user-card">{error}</div>}
          {!loading && !error && tickets.length === 0 && (
            <div className="user-card">No tickets yet. Book a token first.</div>
          )}
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              getEta={getEta}
              onPrint={() => {
                setPrintTicket(ticket);
                setTimeout(() => window.print(), 50);
              }}
            />
          ))}
        </div>
        {printTicket && (
          <div className="ticket-print">
            <h2>GovEase Token Slip</h2>
            <div className="print-number">Token #{printTicket.tokenNumber}</div>
            <p>Center: {printTicket.centerName}</p>
            <p>Department: {printTicket.department || "General"}</p>
            <p>Name: {printTicket.userName}</p>
            <p>Phone: {printTicket.userPhone}</p>
            <p>Status: {printTicket.status}</p>
            <p>
              Issued:{" "}
              {new Date(printTicket.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        )}
        <BottomNav />
      </div>
    </div>
  );
};

const TicketRow = ({ ticket, getEta, onPrint }) => {
  const [eta, setEta] = useState(null);

  useEffect(() => {
    let active = true;
    const loadEta = async () => {
      const result = await getEta(ticket);
      if (active) {
        setEta(result);
      }
    };
    loadEta();
    return () => {
      active = false;
    };
  }, [ticket, getEta]);

  return (
    <div className="ticket-row">
      <div>
        <div className="ticket-token">Token #{ticket.tokenNumber}</div>
        <p className="ticket-center">{ticket.centerName}</p>
        <p className="ticket-meta">
          {ticket.department || "General"} •{" "}
          {new Date(ticket.createdAt).toLocaleString("en-IN")}
        </p>
        {ticket.status === "pending" && eta && (
          <p className="ticket-eta">Your number is coming in ~{eta} min</p>
        )}
      </div>
      <div className="ticket-actions">
        <div className={`ticket-status-badge status-${ticket.status}`}>
          {ticket.status}
        </div>
        <button className="ghost" type="button" onClick={onPrint}>
          Print
        </button>
      </div>
    </div>
  );
};

export default Tickets;
