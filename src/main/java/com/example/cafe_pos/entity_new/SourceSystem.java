package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "source_system", uniqueConstraints = {
        @UniqueConstraint(columnNames = "system_number")
})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SourceSystem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cashier_name")
    private String cashierName;

    @Column(name = "invoice_counter")
    private Integer invoiceCounter;

    @Column(name = "sales_person_name")
    private String salesPersonName;

    @Column(name = "system_number")
    private String systemNumber;

    @Column(name = "system_type")
    private String systemType;

    @Column(name = "branch_name")
    private String branchName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private SellerInfo seller;

    // -----------------------------
    // Getters & Setters
    // -----------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCashierName() {
        return cashierName;
    }

    public void setCashierName(String cashierName) {
        this.cashierName = cashierName;
    }

    public Integer getInvoiceCounter() {
        return invoiceCounter;
    }

    public void setInvoiceCounter(Integer invoiceCounter) {
        this.invoiceCounter = invoiceCounter;
    }

    public String getSalesPersonName() {
        return salesPersonName;
    }

    public void setSalesPersonName(String salesPersonName) {
        this.salesPersonName = salesPersonName;
    }

    public String getSystemNumber() {
        return systemNumber;
    }

    public void setSystemNumber(String systemNumber) {
        this.systemNumber = systemNumber;
    }

    public String getSystemType() {
        return systemType;
    }

    public void setSystemType(String systemType) {
        this.systemType = systemType;
    }

    public String getBranchName() { return branchName; }
    public void setBranchName(String branchName) { this.branchName = branchName; }

    public SellerInfo getSeller() { return seller; }
    public void setSeller(SellerInfo seller) { this.seller = seller; }
}
