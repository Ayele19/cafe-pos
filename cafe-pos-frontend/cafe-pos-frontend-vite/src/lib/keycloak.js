import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const initKeycloak = async () => {
  try {
    const authenticated = await keycloak.init({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
    });

    if (!authenticated) {
      await keycloak.login();
    }

    return keycloak;
  } catch (err) {
    console.error("Keycloak initialization failed", err);
    return null;
  }
};

export const getAccessToken = async () => {
  if (!keycloak.authenticated) {
    return null;
  }

  try {
    await keycloak.updateToken(30);
  } catch (err) {
    console.error("Token refresh failed", err);
    await keycloak.login();
    return null;
  }

  return keycloak.token;
};

export default keycloak;
