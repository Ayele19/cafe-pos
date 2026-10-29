package com.example.cafe_pos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class KeycloakAdminService {

    @Value("${keycloak.admin.url}") private String keycloakUrl;
    @Value("${keycloak.admin.realm}") private String realm;
    @Value("${keycloak.admin.client-id}") private String clientId;
    @Value("${keycloak.admin.username}") private String adminUsername;
    @Value("${keycloak.admin.password}") private String adminPassword;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Get admin access token ──
    private String getAdminToken() {
        String tokenUrl = keycloakUrl + "/realms/master/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", clientId);
        body.add("username", adminUsername);
        body.add("password", adminPassword);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                tokenUrl, new HttpEntity<>(body, headers), Map.class);

        if (response.getBody() == null) throw new RuntimeException("Failed to get Keycloak admin token");
        return (String) response.getBody().get("access_token");
    }

    // ── Create user in Keycloak ──
    public void createUser(String username, String email, String password) {
        String token = getAdminToken();
        String usersUrl = keycloakUrl + "/admin/realms/" + realm + "/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> userRepresentation = Map.of(
                "username", username,
                "email", email,
                "enabled", true,
                "emailVerified", true,
                "credentials", List.of(Map.of(
                        "type", "password",
                        "value", password,
                        "temporary", false
                ))
        );

        ResponseEntity<Void> response = restTemplate.postForEntity(
                usersUrl, new HttpEntity<>(userRepresentation, headers), Void.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Failed to create Keycloak user: " + response.getStatusCode());
        }
    }

    // ── Get user ID by username ──
    public String getUserId(String username) {
        String token = getAdminToken();
        String url = keycloakUrl + "/admin/realms/" + realm + "/users?username=" + username + "&exact=true";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<List> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), List.class);

        if (response.getBody() == null || response.getBody().isEmpty()) {
            throw new RuntimeException("User not found in Keycloak: " + username);
        }

        return (String) ((Map<?, ?>) response.getBody().get(0)).get("id");
    }

    // ── Get realm role ID by name ──
    private String getRoleId(String roleName, String token) {
        String url = keycloakUrl + "/admin/realms/" + realm + "/roles/" + roleName;

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);

        ResponseEntity<Map> response = restTemplate.exchange(
                url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);

        if (response.getBody() == null) throw new RuntimeException("Role not found: " + roleName);
        return (String) response.getBody().get("id");
    }

    // ── Assign realm role to user ──
    public void assignRole(String userId, String roleName) {
        String token = getAdminToken();
        String roleId = getRoleId(roleName, token);

        String url = keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/role-mappings/realm";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        List<Map<String, String>> roles = List.of(Map.of("id", roleId, "name", roleName));

        restTemplate.postForEntity(url, new HttpEntity<>(roles, headers), Void.class);
    }

    // ── Reset user password ──
    public void resetPassword(String userId, String newPassword) {
        String token = getAdminToken();
        String url = keycloakUrl + "/admin/realms/" + realm + "/users/" + userId + "/reset-password";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        Map<String, Object> credential = Map.of(
                "type", "password",
                "value", newPassword,
                "temporary", false
        );

        restTemplate.put(url, new HttpEntity<>(credential, headers));
    }

    // ── Check if username already exists ──
    public boolean userExists(String username) {
        try {
            String userId = getUserId(username);
            return userId != null;
        } catch (Exception e) {
            return false;
        }
    }
}
