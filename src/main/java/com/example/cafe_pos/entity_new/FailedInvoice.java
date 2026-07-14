package com.example.cafe_pos.entity_new;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "failed_invoices")
public class FailedInvoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Invoice counter associated with this order
    private Integer invoiceCounter;

    // Store the full order JSON, optimized for large size
    @Lob
    @Column(columnDefinition = "CLOB") // Works for large JSON
    private String orderJson;

    // Store the error message returned by MOR or other failure reason
    @Column(length = 1000)
    private String errorMessage;

    // Timestamp when this failed invoice was created
    private LocalDateTime createdAt;

    // ===================== Constructors =====================
    public FailedInvoice() { }

    public FailedInvoice(Integer invoiceCounter, String orderJson, String errorMessage, LocalDateTime createdAt) {
        this.invoiceCounter = invoiceCounter;
        this.orderJson = orderJson;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
    }

    // ===================== Getters & Setters =====================
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Integer getInvoiceCounter() { return invoiceCounter; }

    public void setInvoiceCounter(Integer invoiceCounter) { this.invoiceCounter = invoiceCounter; }

    public String getOrderJson() { return orderJson; }

    public void setOrderJson(String orderJson) { this.orderJson = orderJson; }

    public String getErrorMessage() { return errorMessage; }

    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
