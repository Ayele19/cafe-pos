package com.example.cafe_pos.controller;

import com.example.cafe_pos.security.Permission;
import com.example.cafe_pos.service.TaxVerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tax")
public class TaxVerificationController {

    private final TaxVerificationService verificationService;

    public TaxVerificationController(TaxVerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping("/verify")
    @PreAuthorize("hasAuthority('" + Permission.ORDER_READ + "')")
    public ResponseEntity<?> verify(@RequestBody Map<String, String> body) {
        String irn = body.get("irn");
        if (irn == null || irn.isBlank()) {
            return ResponseEntity.badRequest().body("IRN is required");
        }
        String response = verificationService.verifyByIrn(irn);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cancel")
    @PreAuthorize("hasAuthority('" + Permission.ORDER_READ + "')")
    public ResponseEntity<?> cancel(@RequestBody Map<String, String> body) {
        String irn        = body.get("irn");
        String reasonCode = body.get("reasonCode");
        String remark     = body.getOrDefault("remark", "");

        if (irn == null || irn.isBlank())
            return ResponseEntity.badRequest().body("IRN is required");
        if (reasonCode == null || reasonCode.isBlank())
            return ResponseEntity.badRequest().body("Reason code is required");

        String response = verificationService.cancelByIrn(irn, reasonCode, remark);
        return ResponseEntity.ok(response);
    }
}
