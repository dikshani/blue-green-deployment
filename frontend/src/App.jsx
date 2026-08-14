import { useState } from "react";
import "./App.css";

function App() {
  const [activeEnvironment, setActiveEnvironment] = useState("BLUE");

  const isBlue = activeEnvironment === "BLUE";

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">BG</div>
          <span>Blue-Green Demo</span>
        </div>

        <div className="nav-links">
          <a className="active">Home</a>
          <a>About</a>
          <a>Health</a>
          <a>API</a>
          <a>Info</a>
        </div>

        <div className="environment-badge">
          <span className={isBlue ? "dot blue" : "dot green"}></span>
          Environment: {activeEnvironment}
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              CURRENT DEPLOYMENT
            </p>

            <h1>
              You are on the{" "}
              <span className={isBlue ? "blue-text" : "green-text"}>
                {activeEnvironment}
              </span>{" "}
              Environment
            </h1>

            <p className="hero-description">
              Experience zero-downtime deployments with our
              Blue-Green deployment strategy.
            </p>

            <div className="version">
              <span>VERSION</span>
              <strong>{isBlue ? "1.0.0" : "2.0.0"}</strong>
            </div>

            <div className="buttons">
              <button
                className="primary-btn"
                onClick={() =>
                  setActiveEnvironment(isBlue ? "GREEN" : "BLUE")
                }
              >
                Check Health
              </button>

              <button className="secondary-btn">
                View Info
              </button>
            </div>
          </div>

          <div className="environment-card">
            <div className="card-header">
              <span>DEPLOYMENT STATUS</span>
              <span className="status">
                <span className="status-dot"></span>
                Healthy
              </span>
            </div>

            <div className="server-icon">
              {isBlue ? "🔵" : "🟢"}
            </div>

            <h2>{activeEnvironment}</h2>
            <p>Production Environment</p>

            <div className="card-version">
              v{isBlue ? "1.0.0" : "2.0.0"}
            </div>
          </div>
        </section>

        <section className="metrics">
          <div className="metric-card">
            <span>Environment</span>
            <strong>{activeEnvironment}</strong>
            <small>Currently Active</small>
          </div>

          <div className="metric-card">
            <span>Version</span>
            <strong>{isBlue ? "1.0.0" : "2.0.0"}</strong>
            <small>Application Version</small>
          </div>

          <div className="metric-card">
            <span>Uptime</span>
            <strong>99.99%</strong>
            <small>Last 30 days</small>
          </div>

          <div className="metric-card">
            <span>Status</span>
            <strong className="healthy">Healthy</strong>
            <small>All systems operational</small>
          </div>
        </section>

        <section className="info-grid">
          <div className="info-card">
            <div className="info-icon">⚡</div>
            <div>
              <h3>About Blue-Green Deployment</h3>
              <p>
                Blue-Green deployment maintains two identical
                production environments. New releases are deployed
                to the inactive environment and traffic is switched
                only after validation.
              </p>
            </div>
          </div>

          <div className="info-card quick-links">
            <h3>Quick Links</h3>

            <div className="link-item">
              <span>/health</span>
              <span>Health Check →</span>
            </div>

            <div className="link-item">
              <span>/api/info</span>
              <span>API Information →</span>
            </div>

            <div className="link-item">
              <span>/api/version</span>
              <span>Version Information →</span>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>Blue-Green Deployment Demo</span>
        <span>Zero Downtime • Reliable • Secure</span>
      </footer>
    </div>
  );
}

export default App;
