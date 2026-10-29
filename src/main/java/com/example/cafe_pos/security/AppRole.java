package com.example.cafe_pos.security;

import java.util.Optional;

/**
 * CafePOS realm/client roles expected in Keycloak.
 * Incoming names are normalized (case, ROLE_ prefix, cafepos- prefix).
 */
public enum AppRole {
    ADMIN("admin"),
    MANAGER("manager"),
    CASHIER("cashier"),
    AUDITOR("auditor");

    private final String keycloakName;

    AppRole(String keycloakName) {
        this.keycloakName = keycloakName;
    }

    public String keycloakName() {
        return keycloakName;
    }

    public String springRole() {
        return "ROLE_" + keycloakName;
    }

    public static Optional<AppRole> fromTokenRole(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }

        String normalized = raw.trim().toLowerCase();
        int slash = Math.max(normalized.lastIndexOf('/'), normalized.lastIndexOf(':'));
        if (slash >= 0 && slash < normalized.length() - 1) {
            normalized = normalized.substring(slash + 1);
        }
        if (normalized.startsWith("role_")) {
            normalized = normalized.substring(5);
        }
        if (normalized.startsWith("cafepos-") || normalized.startsWith("cafepos_")) {
            normalized = normalized.substring("cafepos-".length());
        } else if (normalized.startsWith("cafe-pos-") || normalized.startsWith("cafe_pos_")) {
            normalized = normalized.substring("cafe-pos-".length());
        }

        return switch (normalized) {
            case "admin", "administrator", "owner", "superadmin", "super-admin" -> Optional.of(ADMIN);
            case "manager", "supervisor" -> Optional.of(MANAGER);
            case "cashier", "pos", "staff" -> Optional.of(CASHIER);
            case "auditor", "accountant", "viewer", "readonly", "read-only" -> Optional.of(AUDITOR);
            default -> Optional.empty();
        };
    }
}
