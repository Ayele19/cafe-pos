package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalItemDTO {

    @JsonProperty("ItemCode")
    private String itemCode;

    @JsonProperty("ProductDescription")
    private String productDescription;

    @JsonProperty("UnitPrice")
    private double unitPrice;

    @JsonProperty("PreTaxValue")
    private double preTaxValue;

    @JsonProperty("TotalLineAmount")
    private double totalLineAmount;

    @JsonProperty("TaxAmount")
    private double taxAmount;

    @JsonProperty("Discount")
    private double discount;

    @JsonProperty("ExciseTaxValue")
    private double exciseTaxValue; // ✅ add this

    @JsonProperty("Quantity")
    private int quantity;

    @JsonProperty("LineNumber")
    private int lineNumber;

    @JsonProperty("NatureOfSupplies")
    private String natureOfSupplies;

    @JsonProperty("TaxCode")
    private String taxCode;

    @JsonProperty("HarmonizationCode")
    private String harmonizationCode;

    @JsonProperty("Unit")
    private String unit;

    // Getters & Setters
    public String getItemCode() { return itemCode; }
    public void setItemCode(String itemCode) { this.itemCode = itemCode; }

    public String getProductDescription() { return productDescription; }
    public void setProductDescription(String productDescription) { this.productDescription = productDescription; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }

    public double getPreTaxValue() { return preTaxValue; }
    public void setPreTaxValue(double preTaxValue) { this.preTaxValue = preTaxValue; }

    public double getTotalLineAmount() { return totalLineAmount; }
    public void setTotalLineAmount(double totalLineAmount) { this.totalLineAmount = totalLineAmount; }

    public double getTaxAmount() { return taxAmount; }
    public void setTaxAmount(double taxAmount) { this.taxAmount = taxAmount; }

    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }

    public double getExciseTaxValue() { return exciseTaxValue; } // ✅ add getter
    public void setExciseTaxValue(double exciseTaxValue) { this.exciseTaxValue = exciseTaxValue; } // ✅ add setter

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public int getLineNumber() { return lineNumber; }
    public void setLineNumber(int lineNumber) { this.lineNumber = lineNumber; }

    public String getNatureOfSupplies() { return natureOfSupplies; }
    public void setNatureOfSupplies(String natureOfSupplies) { this.natureOfSupplies = natureOfSupplies; }

    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String taxCode) { this.taxCode = taxCode; }

    public String getHarmonizationCode() { return harmonizationCode; }
    public void setHarmonizationCode(String harmonizationCode) { this.harmonizationCode = harmonizationCode; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}
