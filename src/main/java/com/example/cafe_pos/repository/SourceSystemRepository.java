package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.SourceSystem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.Optional;

@Repository
public interface SourceSystemRepository extends JpaRepository<SourceSystem, Long> {

    // Pessimistic lock for safe counter increment
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SourceSystem s WHERE s.id = :id")
    Optional<SourceSystem> findByIdForUpdate(@Param("id") Long id);

    // Find MAX invoice counter for specific systemNumber
    @Query("SELECT MAX(s.invoiceCounter) FROM SourceSystem s WHERE s.systemNumber = :systemNumber")
    Optional<Integer> findMaxInvoiceCounter(@Param("systemNumber") String systemNumber);
}
