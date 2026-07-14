package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.TaxApiToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaxApiTokenRepository extends JpaRepository<TaxApiToken, Long> {
}
