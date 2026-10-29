package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.Cashier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CashierRepository extends JpaRepository<Cashier, Long> {
    Optional<Cashier> findByUsername(String username);
    List<Cashier> findBySourceSystemId(Long sourceSystemId);
}
