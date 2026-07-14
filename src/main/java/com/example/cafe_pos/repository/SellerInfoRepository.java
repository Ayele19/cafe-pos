package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.SellerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SellerInfoRepository extends JpaRepository<SellerInfo, Long> {
    // You can add custom queries here if needed
}
