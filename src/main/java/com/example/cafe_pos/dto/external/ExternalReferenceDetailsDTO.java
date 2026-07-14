package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalReferenceDetailsDTO {

    @JsonProperty("PreviousIrn")
    private String previousIrn;

    @JsonProperty("RelatedDocument")
    private String relatedDocument; // nullable

    // Getters & Setters
    public String getPreviousIrn() { return previousIrn; }
    public void setPreviousIrn(String previousIrn) { this.previousIrn = previousIrn; }

    public String getRelatedDocument() { return relatedDocument; }
    public void setRelatedDocument(String relatedDocument) { this.relatedDocument = relatedDocument; }
}
