package com.example.cafe_pos.dto;

import java.util.List;
import com.example.cafe_pos.entity_new.*;

public class OrderDTO {

    private Long id;
    private String transactionType;
    private String version;

    private BuyerInfo buyerInfo;               // ✅ Object
    private SellerInfo sellerInfo;             // ✅ Object
    private DocumentDetails documentDetails;   // ✅ Object
    private PaymentDetails paymentDetails;     // ✅ Object
    private ReferenceDetails referenceDetails; // ✅ Object
    private SourceSystem sourceSystem;         // ✅ Object
    private ValueDetails valueDetails;         // ✅ Object
    private List<OrderItem> items;             // ✅ List

    // ===== Getters & Setters =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public BuyerInfo getBuyerInfo() { return buyerInfo; }
    public void setBuyerInfo(BuyerInfo buyerInfo) { this.buyerInfo = buyerInfo; }

    public SellerInfo getSellerInfo() { return sellerInfo; }
    public void setSellerInfo(SellerInfo sellerInfo) { this.sellerInfo = sellerInfo; }

    public DocumentDetails getDocumentDetails() { return documentDetails; }
    public void setDocumentDetails(DocumentDetails documentDetails) { this.documentDetails = documentDetails; }

    public PaymentDetails getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(PaymentDetails paymentDetails) { this.paymentDetails = paymentDetails; }

    public ReferenceDetails getReferenceDetails() { return referenceDetails; }
    public void setReferenceDetails(ReferenceDetails referenceDetails) { this.referenceDetails = referenceDetails; }

    public SourceSystem getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(SourceSystem sourceSystem) { this.sourceSystem = sourceSystem; }

    public ValueDetails getValueDetails() { return valueDetails; }
    public void setValueDetails(ValueDetails valueDetails) { this.valueDetails = valueDetails; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}
