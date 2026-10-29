package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.SellerInfo;
import com.example.cafe_pos.repository.SellerInfoRepository;
import com.example.cafe_pos.service.KeycloakAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class RegistrationController {

    private final KeycloakAdminService keycloakAdminService;
    private final SellerInfoRepository sellerInfoRepository;

    public RegistrationController(KeycloakAdminService keycloakAdminService,
                                  SellerInfoRepository sellerInfoRepository) {
        this.keycloakAdminService = keycloakAdminService;
        this.sellerInfoRepository = sellerInfoRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            String username   = body.get("username");
            String password   = body.get("password");
            String email      = body.get("email");
            String legalName  = body.get("legalName");
            String tin        = body.get("tin");
            String vatNumber  = body.get("vatNumber");
            String phone      = body.get("phone");
            String region     = body.get("region");
            String city       = body.get("city");
            String wereda     = body.get("wereda");
            String houseNumber = body.get("houseNumber");

            // Validate required fields
            if (username == null || username.isBlank()) return bad("Username is required");
            if (password == null || password.length() < 6) return bad("Password must be at least 6 characters");
            if (email == null || !email.contains("@")) return bad("Valid email is required");
            if (legalName == null || legalName.isBlank()) return bad("Company name is required");
            if (tin == null || tin.isBlank()) return bad("TIN is required");
            if (vatNumber == null || vatNumber.isBlank()) return bad("VAT number is required");

            // Check for duplicate TIN
            if (sellerInfoRepository.findFirstByTin(tin).isPresent()) {
                return bad("A company with this TIN is already registered");
            }

            // Check for duplicate Keycloak username
            if (keycloakAdminService.userExists(username)) {
                return bad("Username already taken");
            }

            // 1. Create Keycloak user
            keycloakAdminService.createUser(username, email, password);

            // 2. Get user ID and assign 'admin' role
            String userId = keycloakAdminService.getUserId(username);
            keycloakAdminService.assignRole(userId, "admin");

            // 3. Save company (SellerInfo) linked to this admin
            SellerInfo seller = new SellerInfo();
            seller.setLegalName(legalName);
            seller.setTin(tin);
            seller.setVatNumber(vatNumber);
            seller.setEmail(email);
            seller.setPhone(phone);
            seller.setRegion(region);
            seller.setCity(city);
            seller.setWereda(wereda);
            seller.setHouseNumber(houseNumber);
            seller.setAdminUsername(username);

            sellerInfoRepository.save(seller);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Registration successful. You can now log in.",
                    "username", username
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Registration failed: " + e.getMessage()
            ));
        }
    }

    private ResponseEntity<Map<String, Object>> bad(String msg) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", msg));
    }
}
