import { createContext, useContext, useMemo } from "react";
import keycloak from "../lib/keycloak";
import { resolveAppRoles, permissionsForRoles } from "./permissions";
import { auditService } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;

  const value = useMemo(() => {
    const roles = resolveAppRoles(
      keycloak?.tokenParsed,
      clientId,
      keycloak?.idTokenParsed
    );
    const permissions = permissionsForRoles(roles);
    const tokenParsed = keycloak?.tokenParsed || {};

    return {
      keycloak,
      authenticated: Boolean(keycloak?.authenticated),
      username: tokenParsed.preferred_username || "",
      email: tokenParsed.email || "",
      roles,
      permissions,
      hasRole: (role) => roles.includes(role),
      hasPermission: (permission) => permissions.includes(permission),
      hasAnyPermission: (required = []) =>
        required.some((permission) => permissions.includes(permission)),
      logout: () => { auditService.logLogout(); keycloak.logout({ redirectUri: window.location.origin + "/?landing=true" }); },
    };
  }, [clientId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
