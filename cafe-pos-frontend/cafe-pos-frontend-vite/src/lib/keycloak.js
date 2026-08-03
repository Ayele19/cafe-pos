// src/lib/keycloak.js
import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloak = new Keycloak({
url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,      // Your client ID
});

// Helper function to login
export const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",    // Force login
      checkLoginIframe: false,     // Disable periodic iframe check
      pkceMethod: "S256",          // PKCE for security
    });

    if (!authenticated) {
      keycloak.login();            // Redirect to Keycloak login if not authenticated
    } 

    return keycloak;
  } catch (err) {
    console.error("Keycloak initialization failed", err);
    return null;
  }
};

export default keycloak;