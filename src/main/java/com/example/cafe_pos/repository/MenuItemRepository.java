package com.example.cafe_pos.repository;

import com.example.cafe_pos.entity_new.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {}
