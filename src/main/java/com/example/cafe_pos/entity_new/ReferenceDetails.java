package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "reference_details")
public class ReferenceDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String previousIrn;
    private String relatedDocument;

    

    // -----------------------------
    // ✅ Getters & Setters
    // -----------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPreviousIrn() {
        return previousIrn;
    }

    public void setPreviousIrn(String previousIrn) {
        this.previousIrn = previousIrn;
    }

    public String getRelatedDocument() {
        return relatedDocument;
    }

    public void setRelatedDocument(String relatedDocument) {
        this.relatedDocument = relatedDocument;
    }


}
