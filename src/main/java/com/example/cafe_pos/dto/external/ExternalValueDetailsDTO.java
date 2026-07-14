package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalValueDetailsDTO {

    @JsonProperty("Discount")
    private Double discount; // nullable

    @JsonProperty("ExciseValue")
    private double exciseValue;

    @JsonProperty("IncomeWithholdValue")
    private double incomeWithholdValue;

    @JsonProperty("TaxValue")
    private double taxValue;

    @JsonProperty("TotalValue")
    private double totalValue;

    @JsonProperty("TransactionWithholdValue")
    private double transactionWithholdValue;

    @JsonProperty("InvoiceCurrency")
    private String invoiceCurrency;

    // Getters & Setters
    public Double getDiscount() { return discount; }
    public void setDiscount(Double discount) { this.discount = discount; }

    public double getExciseValue() { return exciseValue; }
    public void setExciseValue(double exciseValue) { this.exciseValue = exciseValue; }

    public double getIncomeWithholdValue() { return incomeWithholdValue; }
    public void setIncomeWithholdValue(double incomeWithholdValue) { this.incomeWithholdValue = incomeWithholdValue; }

    public double getTaxValue() { return taxValue; }
    public void setTaxValue(double taxValue) { this.taxValue = taxValue; }

    public double getTotalValue() { return totalValue; }
    public void setTotalValue(double totalValue) { this.totalValue = totalValue; }

    public double getTransactionWithholdValue() { return transactionWithholdValue; }
    public void setTransactionWithholdValue(double transactionWithholdValue) { this.transactionWithholdValue = transactionWithholdValue; }

    public String getInvoiceCurrency() { return invoiceCurrency; }
    public void setInvoiceCurrency(String invoiceCurrency) { this.invoiceCurrency = invoiceCurrency; }
}
