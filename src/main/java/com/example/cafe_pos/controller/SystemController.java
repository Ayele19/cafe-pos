package com.example.cafe_pos.controller;

import com.example.cafe_pos.service.SourceSystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final SourceSystemService sourceSystemService;

    public SystemController(SourceSystemService sourceSystemService) {
        this.sourceSystemService = sourceSystemService;
    }

    // ===================== GET: Read-only, show current + 1 =====================
    @GetMapping("/invoiceCounter")
    public ResponseEntity<Map<String, Integer>> getInvoiceCounter(
            @RequestParam(required = false) Long sourceSystemId) {

        if (sourceSystemId == null) {
            sourceSystemId = 1L;
        }

        // Read-only, no increment
        int currentCounter = sourceSystemService.getInvoiceCounter(sourceSystemId);
        return ResponseEntity.ok(Map.of("counter", currentCounter ));
    }

    // ===================== POST: Increment and return next =====================
    @PostMapping("/invoiceCounter/next")
    public ResponseEntity<Map<String, Integer>> getNextInvoiceCounter(
            @RequestParam(required = false) Long sourceSystemId) {

        if (sourceSystemId == null) {
            sourceSystemId = 1L;
        }

        // Increment the counter in DB
        int nextCounter = sourceSystemService.incrementInvoiceCounter(sourceSystemId);
        return ResponseEntity.ok(Map.of("counter", nextCounter));
    }
}
