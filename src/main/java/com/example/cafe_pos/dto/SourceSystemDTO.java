package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SourceSystemDTO {

    @JsonProperty("CashierName")
    private String cashierName;

    @JsonProperty("InvoiceCounter")
    private int invoiceCounter;

    @JsonProperty("SalesPersonName")
    private String salesPersonName;

    @JsonProperty("SystemNumber")
    private String systemNumber;

    @JsonProperty("SystemType")
    private String systemType;

    // ================= Getters & Setters =================
    public String getCashierName() { return cashierName; }
    public void setCashierName(String cashierName) { this.cashierName = cashierName; }

    public int getInvoiceCounter() { return invoiceCounter; }
    public void setInvoiceCounter(int invoiceCounter) { this.invoiceCounter = invoiceCounter; }

    public String getSalesPersonName() { return salesPersonName; }
    public void setSalesPersonName(String salesPersonName) { this.salesPersonName = salesPersonName; }

    public String getSystemNumber() { return systemNumber; }
    public void setSystemNumber(String systemNumber) { this.systemNumber = systemNumber; }

    public String getSystemType() { return systemType; }
    public void setSystemType(String systemType) { this.systemType = systemType; }
}
