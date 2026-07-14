package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DocumentDetailsDTO {

    private String documentNumber;
     @JsonProperty("Date")
    private String date;   // e.g., "2025-09-08T12:00:00"
    private String type;   // e.g., "INV"

    // ====== Getters & Setters ======
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
