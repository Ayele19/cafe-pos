package com.example.cafe_pos.dto;

import com.example.cafe_pos.entity_new.*;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class OrderRequestDTO {

    @JsonProperty("TransactionType")
    private String transactionType;

    @JsonProperty("Version")
    private String version;

    @JsonProperty("BuyerDetails")
    private BuyerInfo buyerDetails;

    @JsonProperty("SellerDetails")
    private SellerInfo sellerDetails;

    @JsonProperty("DocumentDetails")
    private DocumentDetails documentDetails;

    @JsonProperty("ItemList")
    private List<OrderItem> itemList;

    @JsonProperty("PaymentDetails")
    private PaymentDetails paymentDetails;

    @JsonProperty("ReferenceDetails")
    private ReferenceDetails referenceDetails;

    @JsonProperty("ValueDetails")
    private ValueDetails valueDetails;

    // Optional: used by admin to select which branch to use
    @JsonProperty("sourceSystemId")
    private Long sourceSystemId;

    // Getters and Setters
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public BuyerInfo getBuyerDetails() { return buyerDetails; }
    public void setBuyerDetails(BuyerInfo buyerDetails) { this.buyerDetails = buyerDetails; }

    public SellerInfo getSellerDetails() { return sellerDetails; }
    public void setSellerDetails(SellerInfo sellerDetails) { this.sellerDetails = sellerDetails; }

    public DocumentDetails getDocumentDetails() { return documentDetails; }
    public void setDocumentDetails(DocumentDetails documentDetails) { this.documentDetails = documentDetails; }

    public List<OrderItem> getItemList() { return itemList; }
    public void setItemList(List<OrderItem> itemList) { this.itemList = itemList; }

    public PaymentDetails getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(PaymentDetails paymentDetails) { this.paymentDetails = paymentDetails; }

    public ReferenceDetails getReferenceDetails() { return referenceDetails; }
    public void setReferenceDetails(ReferenceDetails referenceDetails) { this.referenceDetails = referenceDetails; }

    public ValueDetails getValueDetails() { return valueDetails; }
    public void setValueDetails(ValueDetails valueDetails) { this.valueDetails = valueDetails; }

    public Long getSourceSystemId() { return sourceSystemId; }
    public void setSourceSystemId(Long sourceSystemId) { this.sourceSystemId = sourceSystemId; }
}