package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByDocumentNumber(String documentNumber);
}
