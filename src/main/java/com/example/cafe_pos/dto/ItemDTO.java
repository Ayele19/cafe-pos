package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class ItemDTO {

    @JsonProperty("ProductDescription")
    private String description;

    @JsonProperty("ItemCode")
    private String itemCode;

    @JsonProperty("Quantity")
    private int quantity;

    @JsonProperty("UnitPrice")
    private BigDecimal unitPrice;

    @JsonProperty("TotalLineAmount")
    private BigDecimal totalLineAmount;

    @JsonProperty("TaxCode")
    private String taxCode;

    @JsonProperty("TaxAmount")
    private BigDecimal taxAmount;

    @JsonProperty("Discount")
    private BigDecimal discount;

    @JsonProperty("ExciseTaxValue")
    private BigDecimal exciseTaxValue;

    @JsonProperty("NatureOfSupplies")
    private String natureOfSupplies;

    @JsonProperty("HarmonizationCode")
    private String harmonizationCode;

    @JsonProperty("Unit")
    private String unit;

    @JsonProperty("LineNumber")
    private int lineNumber;

    private String productDescription;
    private BigDecimal preTaxValue;

    // Getters and Setters
    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public BigDecimal getTotalLineAmount() { return totalLineAmount; }
    public void setTotalLineAmount(BigDecimal totalLineAmount) { this.totalLineAmount = totalLineAmount; }

    public BigDecimal getPreTaxValue() { return preTaxValue; }
    public void setPreTaxValue(BigDecimal preTaxValue) { this.preTaxValue = preTaxValue; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String taxCode) { this.taxCode = taxCode; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getExciseTaxValue() { return exciseTaxValue; }
    public void setExciseTaxValue(BigDecimal exciseTaxValue) { this.exciseTaxValue = exciseTaxValue; }

    public String getNatureOfSupplies() { return natureOfSupplies; }
    public void setNatureOfSupplies(String natureOfSupplies) { this.natureOfSupplies = natureOfSupplies; }

    public String getHarmonizationCode() { return harmonizationCode; }
    public void setHarmonizationCode(String harmonizationCode) { this.harmonizationCode = harmonizationCode; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public int getLineNumber() { return lineNumber; }
    public void setLineNumber(int lineNumber) { this.lineNumber = lineNumber; }
}
