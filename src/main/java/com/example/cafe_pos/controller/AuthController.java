package com.example.cafe_pos.controller;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/me")
    public Map<String, Object> me(JwtAuthenticationToken authentication) {
        Jwt jwt = (Jwt) authentication.getToken();

        List<String> authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .sorted()
                .toList();

        List<String> roles = authorities.stream()
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .toList();

        List<String> permissions = authorities.stream()
                .filter(a -> a.startsWith("PERM_"))
                .toList();

        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");

        return Map.of(
                "subject", jwt.getSubject() != null ? jwt.getSubject() : "",
                "username", username != null ? username : "",
                "email", email != null ? email : "",
                "roles", roles,
                "permissions", permissions
        );
    }
}
