package com.example.cafe_pos.config;

import com.example.cafe_pos.security.AppRole;
import com.example.cafe_pos.security.Permission;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class KeycloakRoleConverterTest {

    private final KeycloakRoleConverter converter = new KeycloakRoleConverter("cashier");

    @Test
    void mapsRealmAndClientRolesAndIgnoresBuiltIns() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .claim("realm_access", Map.of("roles", List.of("CASHIER", "offline_access")))
                .claim("resource_access", Map.of(
                        "cafepos", Map.of("roles", List.of("admin"))
                ))
                .build();

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        List<String> values = authorities.stream().map(GrantedAuthority::getAuthority).toList();

        assertTrue(values.contains(AppRole.CASHIER.springRole()));
        assertTrue(values.contains(AppRole.ADMIN.springRole()));
        assertTrue(values.contains(Permission.MENU_WRITE));
        assertTrue(values.contains(Permission.ORDER_CREATE));
        assertFalse(values.contains("ROLE_offline_access"));
    }

    @Test
    void auditorCannotWriteMenu() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .claim("realm_access", Map.of("roles", List.of("auditor")))
                .build();

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        List<String> values = authorities.stream().map(GrantedAuthority::getAuthority).toList();

        assertTrue(values.contains(Permission.ORDER_READ));
        assertFalse(values.contains(Permission.MENU_WRITE));
        assertFalse(values.contains(Permission.ORDER_CREATE));
    }

    @Test
    void authenticatedUserWithoutAppRoleGetsDefaultCashier() {
        Jwt jwt = Jwt.withTokenValue("token")
                .header("alg", "none")
                .subject("user")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(60))
                .claim("realm_access", Map.of("roles", List.of("offline_access", "uma_authorization")))
                .build();

        Collection<GrantedAuthority> authorities = converter.convert(jwt);
        List<String> values = authorities.stream().map(GrantedAuthority::getAuthority).toList();

        assertTrue(values.contains(AppRole.CASHIER.springRole()));
        assertTrue(values.contains(Permission.ORDER_CREATE));
        assertFalse(values.contains(Permission.MENU_WRITE));
    }
}
