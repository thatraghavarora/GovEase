import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import centers from "../data/centers";
import services from "../data/services.json";
import { fetchTokens } from "../services/api";
import { getSession, logoutLocalUser } from "../services/auth";
import logo from "../assets/logo.png";
import BottomNav from "../components/BottomNav";
import "./home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();

  const [search, setSearch] = useState("");
  const [selectedService, setSelectedService] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [locationStatus, setLocationStatus] = useState("idle");
  const [currentCity, setCurrentCity] = useState("All");
  const [pendingTokens, setPendingTokens] = useState([]);
  const [myTokens, setMyTokens] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const pendingResponse = await fetchTokens({ status: "pending" });
        setPendingTokens(pendingResponse.data);
      } catch (error) {
        setPendingTokens([]);
      }

      if (session?.email) {
        try {
          const myResponse = await fetchTokens({ createdBy: session.email });
          setMyTokens(myResponse.data.slice(-4).reverse());
        } catch (error) {
          setMyTokens([]);
        }
      } else {
        setMyTokens([]);
      }
    };

    load();
  }, [location.pathname, session?.email]);

  const filteredCenters = useMemo(() => {
    const activeService =
      selectedService === "All"
        ? null
        : services.find((service) => service.id === selectedService);

    return centers.filter((center) => {
      const matchesType = activeService
        ? center.type === activeService.categoryType
        : true;
      const matchesLocation =
        locationFilter === "All" || center.location === locationFilter;
      const matchesCity =
        currentCity === "All" || center.city === currentCity;
      const matchesSearch = `${center.name} ${center.code} ${center.location}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchesType && matchesLocation && matchesCity && matchesSearch;
    });
  }, [search, selectedService, locationFilter, currentCity]);

  const totalPending = useMemo(() => {
    return pendingTokens.length;
  }, [pendingTokens]);

  const queueMap = useMemo(() => {
    return pendingTokens.reduce((acc, token) => {
      acc[token.centerId] = (acc[token.centerId] || 0) + 1;
      return acc;
    }, {});
  }, [pendingTokens]);

  const locations = useMemo(() => {
    const unique = Array.from(new Set(centers.map((center) => center.location)));
    return ["All", ...unique];
  }, []);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(centers.map((center) => center.city)));
    return ["All", ...unique];
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    setLocationStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationStatus("granted");
        setCurrentCity("Jaipur");
      },
      () => {
        setLocationStatus("denied");
      },
      { timeout: 5000 }
    );
  };

  return (
    <div className="home-page">
      <div className="home-shell">
        <header className="home-header">
          <div className="avatar-block">
            <img src={logo} alt="GovEase logo" />
            <div>
              <p className="welcome-text">Hi, {session?.name || "Guest"}</p>
              <p className="welcome-subtitle">Find your service quickly</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="ghost"
              onClick={() => {
                logoutLocalUser();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <section className="search-section">
          <input
            type="text"
            placeholder="Search hospital, RTO, or location"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        <section className="category-section">
          <div className="section-title">
            <h2>Services</h2>
            <span>{services.length} categories</span>
          </div>
          <div className="filter-pills">
            <button
              className={selectedService === "All" ? "pill active" : "pill"}
              onClick={() => setSelectedService("All")}
            >
              All
            </button>
            {services.map((service) => (
              <button
                key={service.id}
                className={
                  selectedService === service.id ? "pill active" : "pill"
                }
                onClick={() => setSelectedService(service.id)}
              >
                {service.name}
              </button>
            ))}
          </div>
          <div className="location-filter">
            <div className="location-banner">
              <div>
                <p>Location access</p>
                <span>
                  {locationStatus === "granted"
                    ? "Using Jaipur to show nearby centers."
                    : "Allow location to show Jaipur hospitals."}
                </span>
              </div>
              <button
                className="ghost"
                type="button"
                onClick={requestLocation}
              >
                {locationStatus === "loading" ? "Checking..." : "Allow"}
              </button>
            </div>
            <label>
              City
              <select
                value={currentCity}
                onChange={(event) => setCurrentCity(event.target.value)}
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Location
              <select
                value={locationFilter}
                onChange={(event) => setLocationFilter(event.target.value)}
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>
            <div className="pending-pill">
              Active tokens <strong>{totalPending}</strong>
            </div>
          </div>
        </section>

        <section className="scanner-card">
          <div>
            <p className="card-title">Scan QR to get token</p>
            <p className="muted">Open your camera and scan the queue QR.</p>
          </div>
          <div className="scanner-box">Scanner</div>
          <button className="primary">Open Scanner</button>
        </section>

        <section className="tickets-section">
          <div className="section-title">
            <h2>My tickets</h2>
            <button className="ghost">View all</button>
          </div>
          {myTokens.length === 0 ? (
            <p className="tickets-empty">
              You have not generated a token yet. Book an appointment to see it
              here.
            </p>
          ) : (
            <div className="tickets-grid">
              {myTokens.map((token) => (
                <div key={token.id} className="ticket-card">
                  <div>
                    <p className="ticket-title">{token.centerName}</p>
                    <p className="ticket-meta">
                      #{token.tokenNumber} • {token.centerType}
                    </p>
                  </div>
                  <div className="ticket-status">{token.status}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="centers-section">
          <div className="section-title">
            <h2>Available centers</h2>
            <button className="ghost">See all</button>
          </div>
          <div className="centers-grid">
            {filteredCenters.map((center) => (
              <article key={center.id} className="center-card">
                <div className="center-head">
                  <div>
                    <span className="badge">{center.type}</span>
                    <h3>{center.name}</h3>
                    <p>{center.location}</p>
                  </div>
                  <div className="code-block">
                    <span>Center code</span>
                    <strong>{center.code}</strong>
                  </div>
                </div>
                <div className="center-meta">
                  <div>
                    <span>Pending tokens</span>
                    <strong>{queueMap[center.id] || 0}</strong>
                  </div>
                  <div>
                    <span>Service line</span>
                    <strong>{center.type === "Hospital" ? "OPD" : "RTO"}</strong>
                  </div>
                </div>
                <button
                  className="primary"
                  onClick={() => navigate(`/token/${center.id}`)}
                >
                  Generate Token
                </button>
              </article>
            ))}
          </div>
        </section>

        <BottomNav />
      </div>
    </div>
  );
};

export default Home;
