package com.example.cafe_pos.controller;

import com.example.cafe_pos.security.Permission;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PosController {

    @GetMapping("/admin")
    @PreAuthorize("hasRole('admin')")
    public String adminPanel() {
        return "Admin Dashboard";
    }

    @GetMapping("/pos")
    @PreAuthorize("hasAnyAuthority('" + Permission.ORDER_CREATE + "', '" + Permission.ORDER_READ + "')")
    public String cashierPanel() {
        return "POS Screen";
    }
}
