import React, { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import keycloak, { initKeycloak } from "./lib/keycloak.js";

const Root = () => {
  const [kcReady, setKcReady] = useState(false);

  useEffect(() => {
    initKeycloak().then(() => {
      setKcReady(true);
    });
  }, []);

  if (!kcReady) return <div>Loading...</div>;

  return (
    <StrictMode>
      <BrowserRouter>
        <App keycloak={keycloak} />
      </BrowserRouter>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")).render(<Root />);