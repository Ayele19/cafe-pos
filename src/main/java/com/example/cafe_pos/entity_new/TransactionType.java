package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;

@Entity
@Table(name = "transaction_type")
public class TransactionType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = false)
    private String type;   // B2B, B2C, G2B, etc.

    // Required by JPA
    public TransactionType() {}

    // Allow JSON: "B2B"
    @JsonCreator
    public TransactionType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Serialize JSON as plain string: "B2B"
    @JsonValue
    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return this.type;
    }
}
