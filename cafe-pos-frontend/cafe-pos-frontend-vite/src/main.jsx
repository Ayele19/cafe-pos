import React, { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import Register from "./pages/Register.jsx";
import { initKeycloak } from "./lib/keycloak.js";
import { AuthProvider } from "./auth/AuthContext.jsx";
import { auditService } from "./services/api.js";

const Root = () => {
  const params = new URLSearchParams(window.location.search);
  const startScreen = params.get("landing") === "true" ? "landing" : "landing";
  const [screen, setScreen] = useState(startScreen);

  const goToLogin = async () => {
    setScreen("loading");
    await initKeycloak();
    auditService.logLogin(); // record login
    setScreen("app");
  };

  if (screen === "landing") {
    return <Landing onLogin={goToLogin} onRegister={() => setScreen("register")} />;
  }

  if (screen === "register") {
    return <Register onGoToLogin={goToLogin} />;
  }

  if (screen === "loading") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "#fff"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>☕</div>
          <div style={{ fontSize: "18px" }}>Connecting to CafePOS…</div>
        </div>
      </div>
    );
  }

  return (
    <StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </StrictMode>
  );
};

function Landing({ onLogin, onRegister }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "420px",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1b6375, #1fdf85)",
          padding: "36px 24px",
          textAlign: "center",
          color: "#fff"
        }}>
          <div style={{ fontSize: "52px", marginBottom: "8px" }}>☕</div>
          <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 6px" }}>CafePOS</h1>
          <p style={{ fontSize: "14px", opacity: 0.85, margin: 0 }}>
            Smart point-of-sale for Ethiopian businesses
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: "32px 28px" }}>
          <p style={{
            textAlign: "center", color: "#6b7280",
            fontSize: "14px", marginBottom: "28px", lineHeight: "1.6"
          }}>
            Manage invoices, cashiers, branches and reports — all compliant with MOR e-invoicing.
          </p>

          {/* Login button */}
          <button
            onClick={onLogin}
            style={{
              width: "100%",
              padding: "14px",
              background: "#1b6375",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              marginBottom: "12px",
              transition: "background 0.2s"
            }}
            onMouseEnter={e => e.target.style.background = "#155263"}
            onMouseLeave={e => e.target.style.background = "#1b6375"}
          >
            🔑 Log In
          </button>

          {/* Divider */}
          <div style={{
            display: "flex", alignItems: "center",
            gap: "12px", margin: "16px 0"
          }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Register button */}
          <button
            onClick={onRegister}
            style={{
              width: "100%",
              padding: "14px",
              background: "#fff",
              color: "#1b6375",
              border: "2px solid #1b6375",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.target.style.background = "#f0fdf4"; }}
            onMouseLeave={e => { e.target.style.background = "#fff"; }}
          >
            🏢 Register Your Business
          </button>

          <p style={{
            textAlign: "center", fontSize: "12px",
            color: "#9ca3af", marginTop: "20px"
          }}>
            Registration is free. No credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Root />);
