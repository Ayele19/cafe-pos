package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.SellerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerInfoRepository extends JpaRepository<SellerInfo, Long> {
    Optional<SellerInfo> findFirstByTin(String tin);
    Optional<SellerInfo> findByAdminUsername(String adminUsername);
}
