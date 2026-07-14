package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalDocumentDetailsDTO {

    @JsonProperty("DocumentNumber")
    private String documentNumber;

    @JsonProperty("Date")
    private String date; // format: "09-10-2025T00:00:00"

    @JsonProperty("Type")
    private String type;

    // Getters & Setters
    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
