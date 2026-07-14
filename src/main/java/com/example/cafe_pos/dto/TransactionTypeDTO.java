package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TransactionTypeDTO {

    @JsonProperty("TransactionType")
    private String transactionType;

    // Constructors
    public TransactionTypeDTO() {}

    public TransactionTypeDTO(String transactionType) {
        this.transactionType = transactionType;
    }

    // Getter & Setter
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
}
