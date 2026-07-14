package com.example.cafe_pos.controller;

import com.example.cafe_pos.dto.BuyerDetailsDTO;
import com.example.cafe_pos.entity_new.BuyerInfo;
import com.example.cafe_pos.repository.BuyerInfoRepository;
import org.springframework.http.HttpStatus;
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
    public List<BuyerInfo> getAllBuyers() {
        return buyerInfoRepository.findAll();
    }

    @GetMapping("/{id}")
    public BuyerInfo getBuyer(@PathVariable Long id) {
        return buyerInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BuyerInfo createBuyer(@RequestBody BuyerDetailsDTO dto) {
        BuyerInfo buyer = new BuyerInfo();

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

        return buyerInfoRepository.save(buyer);
    }

    @PutMapping("/{id}")
    public BuyerInfo updateBuyer(@PathVariable Long id, @RequestBody BuyerDetailsDTO dto) {
        BuyerInfo buyer = buyerInfoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

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

        return buyerInfoRepository.save(buyer);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBuyer(@PathVariable Long id) {
        buyerInfoRepository.deleteById(id);
    }
}
