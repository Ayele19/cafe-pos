package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "document_details")
public class DocumentDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String documentNumber;
    private String date;
    private String type;

    @JsonBackReference
    @OneToOne(mappedBy = "documentDetails", fetch = FetchType.LAZY)
    private Order order;

    // ✅ Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; } // ✅ add this back
}
