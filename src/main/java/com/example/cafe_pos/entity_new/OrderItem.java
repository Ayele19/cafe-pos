package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_item")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "menu_item_id", nullable = false)
    private Long menuItemId;

    private String itemCode;
    private String productDescription;

    @Column(precision = 18, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    @Column(precision = 18, scale = 2)
    private BigDecimal preTaxValue = BigDecimal.ZERO;

    @Column(precision = 18, scale = 2)
    private BigDecimal totalLineAmount = BigDecimal.ZERO;

    @Column(precision = 18, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;

    private String taxCode;

    @Column(precision = 18, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    private String natureOfSupplies;

    @Column(precision = 18, scale = 2)
    private BigDecimal exciseTaxValue = BigDecimal.ZERO;

    private String harmonizationCode;
    private String unit;
    private int quantity;
    private int lineNumber;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // -----------------------------
    // ✅ Getters and Setters
    // -----------------------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }

    public String getProductDescription() {
        return productDescription;
    }

    public void setProductDescription(String productDescription) {
        this.productDescription = productDescription;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getPreTaxValue() {
        return preTaxValue;
    }

    public void setPreTaxValue(BigDecimal preTaxValue) {
        this.preTaxValue = preTaxValue;
    }

    public BigDecimal getTotalLineAmount() {
        return totalLineAmount;
    }

    public void setTotalLineAmount(BigDecimal totalLineAmount) {
        this.totalLineAmount = totalLineAmount;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getTaxCode() {
        return taxCode;
    }

    public void setTaxCode(String taxCode) {
        this.taxCode = taxCode;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getNatureOfSupplies() {
        return natureOfSupplies;
    }

    public void setNatureOfSupplies(String natureOfSupplies) {
        this.natureOfSupplies = natureOfSupplies;
    }

    public BigDecimal getExciseTaxValue() {
        return exciseTaxValue;
    }

    public void setExciseTaxValue(BigDecimal exciseTaxValue) {
        this.exciseTaxValue = exciseTaxValue;
    }

    public String getHarmonizationCode() {
        return harmonizationCode;
    }

    public void setHarmonizationCode(String harmonizationCode) {
        this.harmonizationCode = harmonizationCode;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }
}
