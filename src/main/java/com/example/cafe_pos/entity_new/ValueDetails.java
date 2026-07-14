package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "value_details")
public class ValueDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal discount;
    private BigDecimal exciseValue = BigDecimal.ZERO;
    private BigDecimal incomeWithholdValue = BigDecimal.ZERO;
    private BigDecimal taxValue;
    private BigDecimal totalValue;
    private BigDecimal transactionWithholdValue = BigDecimal.ZERO;

    @Column(name = "invoice_currency", nullable = false)
    private String invoiceCurrency;

 

    // -----------------------------
    // ✅ Getters & Setters
    // -----------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getExciseValue() {
        return exciseValue;
    }

    public void setExciseValue(BigDecimal exciseValue) {
        this.exciseValue = exciseValue;
    }

    public BigDecimal getIncomeWithholdValue() {
        return incomeWithholdValue;
    }

    public void setIncomeWithholdValue(BigDecimal incomeWithholdValue) {
        this.incomeWithholdValue = incomeWithholdValue;
    }

    public BigDecimal getTaxValue() {
        return taxValue;
    }

    public void setTaxValue(BigDecimal taxValue) {
        this.taxValue = taxValue;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public BigDecimal getTransactionWithholdValue() {
        return transactionWithholdValue;
    }

    public void setTransactionWithholdValue(BigDecimal transactionWithholdValue) {
        this.transactionWithholdValue = transactionWithholdValue;
    }

    public String getInvoiceCurrency() {
        return invoiceCurrency;
    }

    public void setInvoiceCurrency(String invoiceCurrency) {
        this.invoiceCurrency = invoiceCurrency;
    }

  
}
