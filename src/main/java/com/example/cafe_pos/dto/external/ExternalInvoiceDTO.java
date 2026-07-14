package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ExternalInvoiceDTO  {

    @JsonProperty("BuyerDetails")
    private ExternalBuyerDetailsDTO buyerDetails;

    @JsonProperty("DocumentDetails")
    private ExternalDocumentDetailsDTO documentDetails;

    @JsonProperty("ItemList")
    private List<ExternalItemDTO> itemList;

    @JsonProperty("PaymentDetails")
    private ExternalPaymentDetailsDTO paymentDetails;

    @JsonProperty("ReferenceDetails")
    private ExternalReferenceDetailsDTO referenceDetails;

    @JsonProperty("SellerDetails")
    private ExternalSellerDetailsDTO sellerDetails;

    @JsonProperty("SourceSystem")
    private ExternalSourceSystemDTO sourceSystem;

    @JsonProperty("TransactionType")
    private String transactionType;

    @JsonProperty("ValueDetails")
    private ExternalValueDetailsDTO valueDetails;

    @JsonProperty("Version") // ✅ exact match with MOR JSON
    private String version = "1"; // default "1" to ensure it's always sent

    // Getters & Setters
    public ExternalBuyerDetailsDTO getBuyerDetails() { return buyerDetails; }
    public void setBuyerDetails(ExternalBuyerDetailsDTO buyerDetails) { this.buyerDetails = buyerDetails; }

    public ExternalDocumentDetailsDTO getDocumentDetails() { return documentDetails; }
    public void setDocumentDetails(ExternalDocumentDetailsDTO documentDetails) { this.documentDetails = documentDetails; }

    public List<ExternalItemDTO> getItemList() { return itemList; }
    public void setItemList(List<ExternalItemDTO> itemList) { this.itemList = itemList; }

    public ExternalPaymentDetailsDTO getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(ExternalPaymentDetailsDTO paymentDetails) { this.paymentDetails = paymentDetails; }

    public ExternalReferenceDetailsDTO getReferenceDetails() { return referenceDetails; }
    public void setReferenceDetails(ExternalReferenceDetailsDTO referenceDetails) { this.referenceDetails = referenceDetails; }

    public ExternalSellerDetailsDTO getSellerDetails() { return sellerDetails; }
    public void setSellerDetails(ExternalSellerDetailsDTO sellerDetails) { this.sellerDetails = sellerDetails; }

    public ExternalSourceSystemDTO getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(ExternalSourceSystemDTO sourceSystem) { this.sourceSystem = sourceSystem; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public ExternalValueDetailsDTO getValueDetails() { return valueDetails; }
    public void setValueDetails(ExternalValueDetailsDTO valueDetails) { this.valueDetails = valueDetails; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
}
