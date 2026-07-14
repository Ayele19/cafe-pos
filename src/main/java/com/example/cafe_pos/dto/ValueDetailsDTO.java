package com.example.cafe_pos.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class ValueDetailsDTO {

    @JsonProperty("Discount")
    private BigDecimal discount;

    @JsonProperty("ExciseValue")
    private BigDecimal exciseValue;

    @JsonProperty("IncomeWithholdValue")
    private BigDecimal incomeWithholdValue;

    @JsonProperty("TaxValue")
    private BigDecimal taxValue;

    @JsonProperty("TotalValue")
    private BigDecimal totalValue;

    @JsonProperty("TransactionWithholdValue")
    private BigDecimal transactionWithholdValue;

    @JsonProperty("InvoiceCurrency")
    private String invoiceCurrency;

    // Getters and Setters
    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getExciseValue() { return exciseValue; }
    public void setExciseValue(BigDecimal exciseValue) { this.exciseValue = exciseValue; }

    public BigDecimal getIncomeWithholdValue() { return incomeWithholdValue; }
    public void setIncomeWithholdValue(BigDecimal incomeWithholdValue) { this.incomeWithholdValue = incomeWithholdValue; }

    public BigDecimal getTaxValue() { return taxValue; }
    public void setTaxValue(BigDecimal taxValue) { this.taxValue = taxValue; }

    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }

    public BigDecimal getTransactionWithholdValue() { return transactionWithholdValue; }
    public void setTransactionWithholdValue(BigDecimal transactionWithholdValue) { this.transactionWithholdValue = transactionWithholdValue; }

    public String getInvoiceCurrency() { return invoiceCurrency; }
    public void setInvoiceCurrency(String invoiceCurrency) { this.invoiceCurrency = invoiceCurrency; }
}
