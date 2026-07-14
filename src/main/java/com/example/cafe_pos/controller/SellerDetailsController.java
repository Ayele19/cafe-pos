package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.SellerDetailsDTO;
import com.example.cafe_pos.service.SellerInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerDetailsController {

    @Autowired
    private SellerInfoService sellerInfoService;

    @PostMapping
    public ResponseEntity<SellerDetailsDTO> createSeller(@RequestBody SellerDetailsDTO dto) {
        return ResponseEntity.ok(sellerInfoService.saveSeller(dto));
    }

    @GetMapping
    public ResponseEntity<List<SellerDetailsDTO>> getAllSellers() {
        return ResponseEntity.ok(sellerInfoService.getAllSellers());
    }
}
