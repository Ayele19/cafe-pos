package com.example.cafe_pos.controller;

import com.example.cafe_pos.security.Permission;
import com.example.cafe_pos.service.SourceSystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final SourceSystemService sourceSystemService;

    public SystemController(SourceSystemService sourceSystemService) {
        this.sourceSystemService = sourceSystemService;
    }

    @GetMapping("/invoiceCounter")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_READ + "')")
    public ResponseEntity<Map<String, Integer>> getInvoiceCounter(
            @RequestParam(required = false) Long sourceSystemId) {

        if (sourceSystemId == null) {
            sourceSystemId = 1L;
        }

        int currentCounter = sourceSystemService.getInvoiceCounter(sourceSystemId);
        return ResponseEntity.ok(Map.of("counter", currentCounter));
    }

    @PostMapping("/invoiceCounter/next")
    @PreAuthorize("hasAuthority('" + Permission.SYSTEM_WRITE + "')")
    public ResponseEntity<Map<String, Integer>> getNextInvoiceCounter(
            @RequestParam(required = false) Long sourceSystemId) {

        if (sourceSystemId == null) {
            sourceSystemId = 1L;
        }

        int nextCounter = sourceSystemService.incrementInvoiceCounter(sourceSystemId);
        return ResponseEntity.ok(Map.of("counter", nextCounter));
    }
}
