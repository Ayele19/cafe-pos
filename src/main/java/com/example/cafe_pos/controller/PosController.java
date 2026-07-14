package com.example.cafe_pos.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize; // <--- Add this

@RestController
public class PosController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public String adminPanel() {
        return "Admin Dashboard";
    }

    @GetMapping("/pos")
    @PreAuthorize("hasRole('CASHIER')")
    public String cashierPanel() {
        return "POS Screen";
    }
}