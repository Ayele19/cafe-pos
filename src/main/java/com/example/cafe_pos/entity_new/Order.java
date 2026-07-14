package com.example.cafe_pos.entity_new;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------- ITEMS --------------------
    @JsonManagedReference
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    // -------------------- ACTORS --------------------
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private SellerInfo sellerInfo;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "buyer_id")
    private BuyerInfo buyerInfo;

    // -------------------- PAYMENT4 / REFERENCES --------------------
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "payment_id")
    private PaymentDetails paymentDetails;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "reference_id")
    private ReferenceDetails referenceDetails;

    // -------------------- VALUES & DOCUMENTS --------------------
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "value_details_id")
    private ValueDetails valueDetails;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "document_details_id")
    private DocumentDetails documentDetails;

    // -------------------- LOOKUPS --------------------
    @ManyToOne
    @JoinColumn(name = "source_system_id", nullable = false)
    private SourceSystem sourceSystem;

    @ManyToOne
    @JoinColumn(name = "transaction_type_id", nullable = false)
    private TransactionType transactionType;

    // -------------------- MOR / INVOICE --------------------
    private String version;

    @Column(length = 1000)
    private String irn;              // MOR IRN (null if failed)

    private String invoiceStatus;    // A = Active, F = Failed
    private String documentNumber;   // MOR document number

    // -------------------- GETTERS & SETTERS --------------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) {
        this.items = items;
        if (items != null) {
            items.forEach(i -> i.setOrder(this));
        }
    }

    public SellerInfo getSellerInfo() { return sellerInfo; }
    public void setSellerInfo(SellerInfo sellerInfo) { this.sellerInfo = sellerInfo; }

    public BuyerInfo getBuyerInfo() { return buyerInfo; }
    public void setBuyerInfo(BuyerInfo buyerInfo) { this.buyerInfo = buyerInfo; }

    public PaymentDetails getPaymentDetails() { return paymentDetails; }
    public void setPaymentDetails(PaymentDetails paymentDetails) { this.paymentDetails = paymentDetails; }

    public ReferenceDetails getReferenceDetails() { return referenceDetails; }
    public void setReferenceDetails(ReferenceDetails referenceDetails) { this.referenceDetails = referenceDetails; }

    public ValueDetails getValueDetails() { return valueDetails; }
    public void setValueDetails(ValueDetails valueDetails) { this.valueDetails = valueDetails; }

    public DocumentDetails getDocumentDetails() { return documentDetails; }
    public void setDocumentDetails(DocumentDetails documentDetails) { this.documentDetails = documentDetails; }

    public SourceSystem getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(SourceSystem sourceSystem) { this.sourceSystem = sourceSystem; }

    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getIrn() { return irn; }
    public void setIrn(String irn) { this.irn = irn; }

    public String getInvoiceStatus() { return invoiceStatus; }
    public void setInvoiceStatus(String invoiceStatus) { this.invoiceStatus = invoiceStatus; }

    public String getDocumentNumber() { return documentNumber; }
    public void setDocumentNumber(String documentNumber) { this.documentNumber = documentNumber; }
}
