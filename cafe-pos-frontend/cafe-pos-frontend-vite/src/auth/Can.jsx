import { useAuth } from "./AuthContext";

export function Can({ permission, anyOf, children, fallback = null }) {
  const { hasPermission, hasAnyPermission } = useAuth();

  const allowed = permission
    ? hasPermission(permission)
    : hasAnyPermission(anyOf || []);

  return allowed ? children : fallback;
}
