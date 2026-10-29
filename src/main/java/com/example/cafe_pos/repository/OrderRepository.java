package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    boolean existsByDocumentNumber(String documentNumber);

    @Query("SELECT o FROM Order o WHERE o.sourceSystem.cashierName = :cashierName")
    List<Order> findByCashierName(@Param("cashierName") String cashierName);

    @Query("SELECT o FROM Order o WHERE o.sourceSystem.id = :branchId")
    List<Order> findByBranchId(@Param("branchId") Long branchId);
}
