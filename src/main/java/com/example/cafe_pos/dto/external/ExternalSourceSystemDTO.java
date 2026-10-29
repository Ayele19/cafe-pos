package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalSourceSystemDTO {

    @JsonProperty("SystemNumber")
    private String systemNumber;

    @JsonProperty("SystemType")
    private String systemType;

    @JsonProperty("InvoiceCounter")
    private Integer invoiceCounter; // MOR expects integer, not string

    @JsonProperty("CashierName")
    private String cashierName;

    @JsonProperty("SalesPersonName")
    private String salesPersonName;

    public String getSystemNumber() { return systemNumber; }
    public void setSystemNumber(String systemNumber) { this.systemNumber = systemNumber; }

    public String getSystemType() { return systemType; }
    public void setSystemType(String systemType) { this.systemType = systemType; }

    public Integer getInvoiceCounter() { return invoiceCounter; }
    public void setInvoiceCounter(Integer invoiceCounter) { this.invoiceCounter = invoiceCounter; }

    public String getCashierName() { return cashierName; }
    public void setCashierName(String cashierName) { this.cashierName = cashierName; }

    public String getSalesPersonName() { return salesPersonName; }
    public void setSalesPersonName(String salesPersonName) { this.salesPersonName = salesPersonName; }
}
