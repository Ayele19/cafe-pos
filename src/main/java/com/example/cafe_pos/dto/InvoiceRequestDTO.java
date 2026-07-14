package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class InvoiceRequestDTO {

    @JsonProperty("BuyerDetails")
    private BuyerDetailsDTO buyerDetails;

    @JsonProperty("SellerDetails")
    private SellerDetailsDTO sellerDetails;

    @JsonProperty("DocumentDetails")
    private DocumentDetailsDTO documentDetails;

    @JsonProperty("ItemList")
    private List<ItemDTO> itemList;

    @JsonProperty("PaymentDetails")
    private PaymentDetailsDTO paymentDetails;

    @JsonProperty("ReferenceDetails")
    private ReferenceDetailsDTO referenceDetails;

    @JsonProperty("SourceSystem")
    private SourceSystemDTO sourceSystem;

    @JsonProperty("TransactionType")
    private String transactionType; // You can also use TransactionTypeDTO if it's enum-like

    @JsonProperty("ValueDetails")
    private ValueDetailsDTO valueDetails;

    @JsonProperty("Version")
    private String version;

    // Getters and Setters
    public BuyerDetailsDTO getBuyerDetails() { return buyerDetails; }
    public void setBuyerDetails(BuyerDetailsDTO buyerDetails) { this.buyerDetails = buyerDetails; }

    public SellerDetailsDTO getSellerDetails() { return sellerDetails; }
    public void setSellerDetails(SellerDetailsDTO sellerDetails) { this.sellerDetails = sellerDetails; }

    public DocumentDetailsDTO getDocumentDetails() { return documentDetails; }
    public void setDocumentDetails(DocumentDetailsDTO documentDetails) { this.documentDetails = documentDetails; }

    public List<ItemDTO> getItemList() { return itemList; }
    public void setItemList(List<ItemDTO> itemList) { this.itemList = itemList; }

    public PaymentDetailsDTO getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(PaymentDetailsDTO paymentDetails) { this.paymentDetails = paymentDetails; }

    public ReferenceDetailsDTO getReferenceDetails() { return referenceDetails; }
    public void setReferenceDetails(ReferenceDetailsDTO referenceDetails) { this.referenceDetails = referenceDetails; }

    public SourceSystemDTO getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(SourceSystemDTO sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public ValueDetailsDTO getValueDetails() { return valueDetails; }
    public void setValueDetails(ValueDetailsDTO valueDetails) { this.valueDetails = valueDetails; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}
