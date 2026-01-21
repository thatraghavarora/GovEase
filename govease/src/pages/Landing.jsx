import "../App.css";

function Landing() {
  return (
    <div className="app">
      <header className="hero">
        <nav className="nav">
          <div className="brand">
            <span className="brand-mark">◎</span>
            GetMyToken
          </div>
          <div className="nav-links">
            <a href="#solution">Solution</a>
            <a href="#use-cases">Use Cases</a>
            <a href="#flow">Flow</a>
            <a className="nav-cta" href="/login">
              Launch a Queue
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Queue Management System</p>
            <h1>
              Create a virtual queue in minutes. Let people wait wherever they
              want.
            </h1>
            <p className="lead">
              GetMyToken turns chaotic lines into smooth digital flows. Spin up
              a queue page, share a QR code, and serve every customer or guest
              with calm, real-time updates.
            </p>
            <div className="hero-actions">
              <a className="primary" href="/login">
                Create a queue
              </a>
              <button className="ghost">Watch a demo</button>
            </div>
            <div className="hero-metrics">
              <div>
                <p className="metric-value">2 min</p>
                <p className="metric-label">Setup time</p>
              </div>
              <div>
                <p className="metric-value">1 tap</p>
                <p className="metric-label">Token booking</p>
              </div>
              <div>
                <p className="metric-value">0 chaos</p>
                <p className="metric-label">At the counter</p>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <p>Event Check-In Queue</p>
              <span className="card-status">Live</span>
            </div>
            <div className="card-token">
              <div className="token-circle">A17</div>
              <div>
                <p className="token-title">Your token</p>
                <p className="token-subtitle">Estimated wait: 12 min</p>
              </div>
            </div>
            <div className="card-progress">
              <div className="progress-bar" />
              <p>You're 5 spots away. We will notify you.</p>
            </div>
            <div className="card-actions">
              <button>Notify me</button>
              <button className="outline">Share QR</button>
            </div>
          </div>
        </div>
      </header>

      <section className="section problem">
        <div className="section-inner">
          <h2>Problem Identified</h2>
          <p>
            Manual queues waste time, frustrate customers, and overload staff.
            Small businesses and one-off events often cannot afford traditional
            queue systems, yet they still need the same calm, orderly experience.
          </p>
          <div className="problem-grid">
            <div>
              <h3>Long waits</h3>
              <p>People stand in line with no visibility, losing patience.</p>
            </div>
            <div>
              <h3>Noisy counters</h3>
              <p>Staff must manage the line while trying to serve customers.</p>
            </div>
            <div>
              <h3>Zero data</h3>
              <p>Organizers lack insight into peak times and drop-offs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section solution" id="solution">
        <div className="section-inner">
          <div className="split">
            <div>
              <h2>The Solution</h2>
              <p>
                GetMyToken gives every business a lightweight, use-and-throw
                queue page. Launch it once for a festival, or keep it running
                for daily clinic bookings. Customers scan, tap, and wait freely.
              </p>
            </div>
            <ul className="solution-list">
              <li>Instant queue page with branding and instructions</li>
              <li>QR code that opens a 1-click token booking flow</li>
              <li>SMS-ready notifications as turns approach</li>
              <li>Dashboard for staff to verify and serve tokens</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section use-cases" id="use-cases">
        <div className="section-inner">
          <h2>Use Cases</h2>
          <div className="use-cases-grid">
            <article>
              <h3>Event Check-In Counters</h3>
              <p>
                Handle large attendee arrivals with a calm digital queue and
                fast verification at the desk.
              </p>
            </article>
            <article>
              <h3>Microservice Desks</h3>
              <p>
                From salons to municipal counters, keep service order without
                building a full appointment system.
              </p>
            </article>
            <article>
              <h3>Pop-up Campaigns</h3>
              <p>
                Use a queue for launch events, product drops, and brand
                activations without setup overhead.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section flow" id="flow">
        <div className="section-inner">
          <h2>Use Case Flow: Event Check-In</h2>
          <ol className="flow-list">
            <li>
              <span>01</span>
              <div>
                <h4>Create virtual queue</h4>
                <p>Organizers set up the check-in queue in under 2 minutes.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h4>Generate QR code</h4>
                <p>Print and place the QR at the entrance or waiting area.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h4>Scan and book token</h4>
                <p>
                  Attendees enter their name and mobile number to receive a
                  digital token instantly.
                </p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <h4>Mobile notifications</h4>
                <p>
                  Guests wait comfortably while GetMyToken alerts them when
                  their turn is near.
                </p>
              </div>
            </li>
            <li>
              <span>05</span>
              <div>
                <h4>Fast check-in</h4>
                <p>
                  Staff verify tokens on arrival and keep the physical queue
                  moving smoothly.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section cta">
        <div className="section-inner cta-inner">
          <div>
            <h2>Ready to bring order to any queue?</h2>
            <p>
              Launch a GetMyToken queue today and turn every wait into a calm,
              mobile-first experience.
            </p>
          </div>
          <a className="primary" href="/register">
            Generate your QR
          </a>
        </div>
      </section>
    </div>
  );
}

export default Landing;
