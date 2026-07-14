package com.example.cafe_pos.service;

import com.example.cafe_pos.dto.SellerDetailsDTO;
import com.example.cafe_pos.entity_new.SellerInfo;
import com.example.cafe_pos.repository.SellerInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerInfoService {

    @Autowired
    private SellerInfoRepository sellerInfoRepository;

    // Save seller
    public SellerDetailsDTO saveSeller(SellerDetailsDTO dto) {
        SellerInfo entity = mapToEntity(dto);
        SellerInfo saved = sellerInfoRepository.save(entity);
        return mapToDTO(saved);
    }

    // Get all sellers
    public List<SellerDetailsDTO> getAllSellers() {
        return sellerInfoRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Mapper: DTO -> Entity
    private SellerInfo mapToEntity(SellerDetailsDTO dto) {
        SellerInfo entity = new SellerInfo();
        entity.setTin(dto.getTin());
        entity.setLegalName(dto.getLegalName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setVatNumber(dto.getVatNumber());
        entity.setCity(dto.getCity());
        entity.setRegion(dto.getRegion());
        entity.setWereda(dto.getWereda());
        entity.setSubCity(dto.getSubCity());
        entity.setHouseNumber(dto.getHouseNumber());
        entity.setLocality(dto.getLocality());
        return entity;
    }

    // Mapper: Entity -> DTO
    private SellerDetailsDTO mapToDTO(SellerInfo entity) {
        SellerDetailsDTO dto = new SellerDetailsDTO();
        dto.setTin(entity.getTin());
        dto.setLegalName(entity.getLegalName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setVatNumber(entity.getVatNumber());
        dto.setCity(entity.getCity());
        dto.setRegion(entity.getRegion());
        dto.setWereda(entity.getWereda());
        dto.setSubCity(entity.getSubCity());
        dto.setHouseNumber(entity.getHouseNumber());
        dto.setLocality(entity.getLocality());
        return dto;
    }
}
