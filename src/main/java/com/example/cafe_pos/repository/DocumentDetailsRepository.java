package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.DocumentDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DocumentDetailsRepository extends JpaRepository<DocumentDetails, Long> {
}
