package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Custom method to delete all order items by order ID
    void deleteAllByOrderId(Long orderId);
}
