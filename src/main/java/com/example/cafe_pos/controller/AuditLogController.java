package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.AuditLog;
import com.example.cafe_pos.repository.AuditLogRepository;
import com.example.cafe_pos.security.Permission;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;

    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    // Called by frontend on login
    @PostMapping("/login")
    public ResponseEntity<?> logLogin(JwtAuthenticationToken authentication,
                                       HttpServletRequest request) {
        String username = authentication.getToken().getClaimAsString("preferred_username");
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .collect(Collectors.joining(", "));

        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction("LOGIN");
        log.setLoggedAt(LocalDateTime.now());
        log.setIpAddress(getClientIp(request));
        log.setRoles(roles);

        auditLogRepository.save(log);
        return ResponseEntity.ok(Map.of("logged", true));
    }

    // Called by frontend on logout
    @PostMapping("/logout")
    public ResponseEntity<?> logLogout(JwtAuthenticationToken authentication,
                                        HttpServletRequest request) {
        String username = authentication.getToken().getClaimAsString("preferred_username");

        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction("LOGOUT");
        log.setLoggedAt(LocalDateTime.now());
        log.setIpAddress(getClientIp(request));
        log.setRoles("");

        auditLogRepository.save(log);
        return ResponseEntity.ok(Map.of("logged", true));
    }

    // Admin reads audit logs
    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_READ + "')")
    public List<AuditLog> getLogs() {
        return auditLogRepository.findAllByOrderByLoggedAtDesc();
    }

    private String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        return forwarded != null ? forwarded.split(",")[0].trim() : request.getRemoteAddr();
    }
}
