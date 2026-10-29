package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.SellerDetailsDTO;
import com.example.cafe_pos.security.Permission;
import com.example.cafe_pos.service.SellerInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerDetailsController {

    private final SellerInfoService sellerInfoService;

    public SellerDetailsController(SellerInfoService sellerInfoService) {
        this.sellerInfoService = sellerInfoService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.SELLER_READ + "')")
    public ResponseEntity<List<SellerDetailsDTO>> getAllSellers() {
        return ResponseEntity.ok(sellerInfoService.getAllSellers());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + Permission.SELLER_WRITE + "')")
    public ResponseEntity<SellerDetailsDTO> createSeller(@RequestBody SellerDetailsDTO dto) {
        return ResponseEntity.ok(sellerInfoService.saveSeller(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.SELLER_WRITE + "')")
    public ResponseEntity<SellerDetailsDTO> updateSeller(@PathVariable Long id,
                                                          @RequestBody SellerDetailsDTO dto) {
        return ResponseEntity.ok(sellerInfoService.updateSeller(id, dto));
    }
}
