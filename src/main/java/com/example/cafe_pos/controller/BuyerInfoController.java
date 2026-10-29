package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.BuyerDetailsDTO;
import com.example.cafe_pos.entity_new.BuyerInfo;
import com.example.cafe_pos.repository.BuyerInfoRepository;
import com.example.cafe_pos.security.Permission;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buyers")
public class BuyerInfoController {

    private final BuyerInfoRepository buyerInfoRepository;

    public BuyerInfoController(BuyerInfoRepository buyerInfoRepository) {
        this.buyerInfoRepository = buyerInfoRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.CUSTOMER_READ + "')")
    public List<BuyerInfo> getAllBuyers() {
        // Return only distinct buyers by keeping the latest record per TIN/phone
        List<BuyerInfo> all = buyerInfoRepository.findAll();
        return all.stream()
                .collect(java.util.stream.Collectors.toMap(
                        b -> b.getTin() != null && !b.getTin().isBlank()
                                ? b.getTin()
                                : (b.getPhone() != null ? b.getPhone() : String.valueOf(b.getId())),
                        b -> b,
                        (existing, replacement) -> replacement.getId() > existing.getId() ? replacement : existing
                ))
                .values()
                .stream()
                .sorted(java.util.Comparator.comparing(BuyerInfo::getId))
                .collect(java.util.stream.Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.CUSTOMER_READ + "')")
    public BuyerInfo getBuyer(@PathVariable Long id) {
        return buyerInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('" + Permission.CUSTOMER_WRITE + "')")
    public BuyerInfo createBuyer(@RequestBody BuyerDetailsDTO dto) {
        // Reuse existing buyer by TIN (B2B) or phone (B2C) to avoid duplicates
        BuyerInfo buyer = null;
        if (dto.getTin() != null && !dto.getTin().isBlank()) {
            buyer = buyerInfoRepository.findFirstByTin(dto.getTin()).orElse(null);
        }
        if (buyer == null && dto.getPhone() != null && !dto.getPhone().isBlank()) {
            buyer = buyerInfoRepository.findFirstByPhone(dto.getPhone()).orElse(null);
        }
        if (buyer == null) {
            buyer = new BuyerInfo();
        }
        apply(dto, buyer);
        return buyerInfoRepository.save(buyer);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.CUSTOMER_WRITE + "')")
    public BuyerInfo updateBuyer(@PathVariable Long id, @RequestBody BuyerDetailsDTO dto) {
        BuyerInfo buyer = buyerInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        apply(dto, buyer);
        return buyerInfoRepository.save(buyer);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('" + Permission.CUSTOMER_DELETE + "')")
    public void deleteBuyer(@PathVariable Long id) {
        buyerInfoRepository.deleteById(id);
    }

    private void apply(BuyerDetailsDTO dto, BuyerInfo buyer) {
        buyer.setLegalName(dto.getLegalName());
        buyer.setEmail(dto.getEmail());
        buyer.setPhone(dto.getPhone());
        buyer.setHouseNumber(dto.getHouseNumber());
        buyer.setCity(dto.getCity());
        buyer.setRegion(dto.getRegion());
        buyer.setZone(dto.getZone());
        buyer.setKebele(dto.getKebele());
        buyer.setWereda(dto.getWereda());
        buyer.setTin(dto.getTin());
        buyer.setVatNumber(dto.getVatNumber());
        buyer.setIdNumber(dto.getIdNumber());
        buyer.setIdType(dto.getIdType());
        buyer.setCountry(dto.getCountry());
    }
}
