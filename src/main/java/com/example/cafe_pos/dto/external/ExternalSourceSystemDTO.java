package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalSourceSystemDTO {

    @JsonProperty("SystemNumber")
    private String systemNumber;

    @JsonProperty("SystemType")
    private String systemType;

    @JsonProperty("InvoiceCounter")
    private String invoiceCounter;

    @JsonProperty("CashierName")
    private String cashierName;

    @JsonProperty("SalesPersonName")
    private String salesPersonName;

    // Getters & Setters
    public String getSystemNumber() { return systemNumber; }
    public void setSystemNumber(String systemNumber) { this.systemNumber = systemNumber; }

    public String getSystemType() { return systemType; }
    public void setSystemType(String systemType) { this.systemType = systemType; }

    public String getInvoiceCounter() { return invoiceCounter; }
    public void setInvoiceCounter(String invoiceCounter) { this.invoiceCounter = invoiceCounter; }

    public String getCashierName() { return cashierName; }
    public void setCashierName(String cashierName) { this.cashierName = cashierName; }

    public String getSalesPersonName() { return salesPersonName; }
    public void setSalesPersonName(String salesPersonName) { this.salesPersonName = salesPersonName; }
}
