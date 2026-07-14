package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TransactionTypeRepository extends JpaRepository<TransactionType, Long> {
    
    // Return Optional
    Optional<TransactionType> findByType(String type);
}
