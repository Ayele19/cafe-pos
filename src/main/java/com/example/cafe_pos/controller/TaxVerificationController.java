package com.example.cafe_pos.controller;

import com.example.cafe_pos.service.TaxVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tax")
public class TaxVerificationController {

    private final TaxVerificationService verificationService;

    public TaxVerificationController(TaxVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    // ------------------------------------------------------------
    // Verify invoice by IRN
    // ------------------------------------------------------------
    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {

        String irn = body.get("irn");
        if (irn == null || irn.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("IRN is required");
        }

        String response = verificationService.verifyByIrn(irn);
        return ResponseEntity.ok(response);
    }
}
