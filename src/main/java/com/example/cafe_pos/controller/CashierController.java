package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.Cashier;
import com.example.cafe_pos.entity_new.SourceSystem;
import com.example.cafe_pos.repository.CashierRepository;
import com.example.cafe_pos.repository.SourceSystemRepository;
import com.example.cafe_pos.security.Permission;
import com.example.cafe_pos.service.KeycloakAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cashiers")
public class CashierController {

    private final CashierRepository cashierRepository;
    private final SourceSystemRepository sourceSystemRepository;
    private final KeycloakAdminService keycloakAdminService;

    public CashierController(CashierRepository cashierRepository,
                             SourceSystemRepository sourceSystemRepository,
                             KeycloakAdminService keycloakAdminService) {
        this.cashierRepository = cashierRepository;
        this.sourceSystemRepository = sourceSystemRepository;
        this.keycloakAdminService = keycloakAdminService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_READ + "')")
    public List<Cashier> getAll() {
        return cashierRepository.findAll();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal Jwt jwt) {
        String username = jwt.getClaimAsString("preferred_username");
        return cashierRepository.findByUsername(username)
                .map(cashier -> {
                    Map<String, Object> res = new java.util.LinkedHashMap<>();
                    res.put("id", cashier.getId());
                    res.put("username", cashier.getUsername());
                    res.put("displayName", cashier.getDisplayName());
                    res.put("active", cashier.isActive());
                    SourceSystem ss = cashier.getSourceSystem();
                    if (ss != null) {
                        Map<String, Object> branch = new java.util.LinkedHashMap<>();
                        branch.put("id", ss.getId());
                        branch.put("systemNumber", ss.getSystemNumber());
                        branch.put("systemType", ss.getSystemType());
                        branch.put("branchName", ss.getBranchName());
                        branch.put("cashierName", ss.getCashierName());
                        if (ss.getSeller() != null) {
                            Map<String, Object> seller = new java.util.LinkedHashMap<>();
                            seller.put("id", ss.getSeller().getId());
                            seller.put("legalName", ss.getSeller().getLegalName());
                            seller.put("tin", ss.getSeller().getTin());
                            seller.put("vatNumber", ss.getSeller().getVatNumber());
                            seller.put("email", ss.getSeller().getEmail());
                            seller.put("phone", ss.getSeller().getPhone());
                            seller.put("region", ss.getSeller().getRegion());
                            seller.put("wereda", ss.getSeller().getWereda());
                            seller.put("city", ss.getSeller().getCity());
                            seller.put("houseNumber", ss.getSeller().getHouseNumber());
                            branch.put("seller", seller);
                        }
                        res.put("sourceSystem", branch);
                    }
                    return ResponseEntity.ok(res);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            String username    = (String) body.get("username");
            String displayName = (String) body.get("displayName");
            String email       = (String) body.get("email");
            String password    = (String) body.get("password");
            Long sourceSystemId = Long.valueOf(body.get("sourceSystemId").toString());

            // Validate
            if (username == null || username.isBlank())
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            if (password == null || password.length() < 6)
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));
            if (email == null || !email.contains("@"))
                return ResponseEntity.badRequest().body(Map.of("error", "Valid email is required"));

            // Check duplicate in local DB
            if (cashierRepository.findByUsername(username).isPresent())
                return ResponseEntity.badRequest().body(Map.of("error", "Cashier with this username already exists"));

            // Check duplicate in Keycloak
            if (keycloakAdminService.userExists(username))
                return ResponseEntity.badRequest().body(Map.of("error", "Username already taken in Keycloak"));

            SourceSystem branch = sourceSystemRepository.findById(sourceSystemId)
                    .orElseThrow(() -> new RuntimeException("Branch not found: " + sourceSystemId));

            // 1. Create Keycloak user
            keycloakAdminService.createUser(username, email, password);

            // 2. Assign 'cashier' role
            String userId = keycloakAdminService.getUserId(username);
            keycloakAdminService.assignRole(userId, "cashier");

            // 3. Save cashier in local DB
            Cashier cashier = new Cashier();
            cashier.setUsername(username);
            cashier.setDisplayName(displayName);
            cashier.setSourceSystem(branch);
            cashier.setActive(true);

            return ResponseEntity.ok(cashierRepository.save(cashier));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Cashier cashier = cashierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cashier not found"));

        if (body.containsKey("displayName")) cashier.setDisplayName((String) body.get("displayName"));
        if (body.containsKey("active")) cashier.setActive((Boolean) body.get("active"));
        if (body.containsKey("sourceSystemId")) {
            Long ssId = Long.valueOf(body.get("sourceSystemId").toString());
            SourceSystem branch = sourceSystemRepository.findById(ssId)
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
            cashier.setSourceSystem(branch);
        }

        return ResponseEntity.ok(cashierRepository.save(cashier));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Cashier cashier = cashierRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Cashier not found"));
            String newPassword = (String) body.get("password");
            if (newPassword == null || newPassword.length() < 6)
                return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 6 characters"));

            String username = cashier.getUsername();

            // If cashier doesn't exist in Keycloak yet (created before integration),
            // create them now with a placeholder email and the new password
            if (!keycloakAdminService.userExists(username)) {
                String email = (String) body.getOrDefault("email",
                        username.replaceAll("[^a-zA-Z0-9]", "") + "@cafepos.local");
                keycloakAdminService.createUser(username, email, newPassword);
                String userId = keycloakAdminService.getUserId(username);
                keycloakAdminService.assignRole(userId, "cashier");
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Keycloak account created and password set",
                        "created", true
                ));
            }

            String userId = keycloakAdminService.getUserId(username);
            keycloakAdminService.resetPassword(userId, newPassword);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        Cashier cashier = cashierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cashier not found"));
        cashier.setActive(false);
        cashierRepository.save(cashier);
        return ResponseEntity.noContent().build();
    }
}
