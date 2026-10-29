package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.BuyerInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BuyerInfoRepository extends JpaRepository<BuyerInfo, Long> {
    Optional<BuyerInfo> findFirstByTin(String tin);
    Optional<BuyerInfo> findFirstByPhone(String phone);
}
