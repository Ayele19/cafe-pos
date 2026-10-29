export const ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  CASHIER: "cashier",
  AUDITOR: "auditor",
};

export const PERMISSIONS = {
  MENU_READ: "PERM_MENU_READ",
  MENU_WRITE: "PERM_MENU_WRITE",
  ORDER_READ: "PERM_ORDER_READ",
  ORDER_CREATE: "PERM_ORDER_CREATE",
  CUSTOMER_READ: "PERM_CUSTOMER_READ",
  CUSTOMER_WRITE: "PERM_CUSTOMER_WRITE",
  CUSTOMER_DELETE: "PERM_CUSTOMER_DELETE",
  SELLER_READ: "PERM_SELLER_READ",
  SELLER_WRITE: "PERM_SELLER_WRITE",
  SYSTEM_READ: "PERM_SYSTEM_READ",
  SYSTEM_WRITE: "PERM_SYSTEM_WRITE",
  TAX_VERIFY: "PERM_TAX_VERIFY",
};

const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.MANAGER]: ALL_PERMISSIONS,
  [ROLES.CASHIER]: [
    PERMISSIONS.MENU_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.ORDER_CREATE,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.CUSTOMER_WRITE,
    PERMISSIONS.SELLER_READ,
    PERMISSIONS.SYSTEM_READ,
    PERMISSIONS.SYSTEM_WRITE,
  ],
  [ROLES.AUDITOR]: [
    PERMISSIONS.MENU_READ,
    PERMISSIONS.ORDER_READ,
    PERMISSIONS.CUSTOMER_READ,
    PERMISSIONS.SELLER_READ,
    PERMISSIONS.SYSTEM_READ,
    PERMISSIONS.TAX_VERIFY,
  ],
};

const APP_ROLES = new Set(Object.values(ROLES));
const ALIASES = {
  administrator: ROLES.ADMIN,
  owner: ROLES.ADMIN,
  superadmin: ROLES.ADMIN,
  "super-admin": ROLES.ADMIN,
  supervisor: ROLES.MANAGER,
  pos: ROLES.CASHIER,
  staff: ROLES.CASHIER,
  accountant: ROLES.AUDITOR,
  viewer: ROLES.AUDITOR,
  readonly: ROLES.AUDITOR,
  "read-only": ROLES.AUDITOR,
};

export function normalizeRole(role) {
  if (!role) return null;
  let value = String(role).trim().toLowerCase();
  value = value.replace(/^\/+/, "");
  const sep = Math.max(value.lastIndexOf("/"), value.lastIndexOf(":"));
  if (sep >= 0 && sep < value.length - 1) {
    value = value.slice(sep + 1);
  }
  value = value.replace(/^role_/, "");
  value = value.replace(/^cafepos[-_]/, "");
  value = value.replace(/^cafe-pos[-_]/, "");
  value = value.replace(/^cafe_pos[-_]/, "");

  if (APP_ROLES.has(value)) return value;
  return ALIASES[value] || null;
}

function collectRoleNames(token) {
  if (!token) return [];
  const names = [
    ...(token.realm_access?.roles || []),
    ...(token.roles || []),
    ...(token.groups || []),
  ];
  Object.values(token.resource_access || {}).forEach((client) => {
    names.push(...(client?.roles || []));
  });
  return names;
}

export function extractRolesFromToken(tokenParsed, clientId, idTokenParsed) {
  const roles = new Set();
  [...collectRoleNames(tokenParsed), ...collectRoleNames(idTokenParsed)].forEach((role) => {
    const normalized = normalizeRole(role);
    if (normalized) roles.add(normalized);
  });
  return [...roles];
}

export function resolveAppRoles(tokenParsed, clientId, idTokenParsed) {
  const roles = extractRolesFromToken(tokenParsed, clientId, idTokenParsed);
  if (roles.length) return roles;

  const fallback = (import.meta.env.VITE_RBAC_DEFAULT_ROLE || "cashier").toLowerCase();
  return APP_ROLES.has(fallback) ? [fallback] : [];
}

export function permissionsForRoles(roles) {
  const permissions = new Set();
  roles.forEach((role) => {
    (ROLE_PERMISSIONS[role] || []).forEach((permission) => permissions.add(permission));
  });
  return [...permissions];
}
