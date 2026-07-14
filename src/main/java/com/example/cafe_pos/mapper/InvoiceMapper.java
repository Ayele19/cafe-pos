package com.example.cafe_pos.mapper;

import com.example.cafe_pos.dto.*;
import com.example.cafe_pos.entity_new.*;
import java.util.List;
import java.util.stream.Collectors;

public class InvoiceMapper {

    // ================= DTO → ENTITY =================
    public static Order toEntity(InvoiceRequestDTO dto) {
        Order order = new Order();

        if (dto.getBuyerDetails() != null) {
            order.setBuyerInfo(toEntity(dto.getBuyerDetails()));
        }

        if (dto.getDocumentDetails() != null) {
            order.setDocumentDetails(toEntity(dto.getDocumentDetails()));
        }

        if (dto.getItemList() != null) {
            List<OrderItem> items = dto.getItemList().stream()
                    .map(itemDTO -> toEntity(itemDTO, order))
                    .collect(Collectors.toList());
            order.setItems(items);
        }

        if (dto.getPaymentDetails() != null) {
            order.setPaymentDetails(toEntity(dto.getPaymentDetails())); // removed setOrder
        }

        if (dto.getReferenceDetails() != null) {
            order.setReferenceDetails(toEntity(dto.getReferenceDetails()));
        }

        if (dto.getSellerDetails() != null) {
            order.setSellerInfo(toEntity(dto.getSellerDetails()));
        }

        if (dto.getSourceSystem() != null) {
            order.setSourceSystem(toEntity(dto.getSourceSystem()));
        }

        if (dto.getTransactionType() != null) {
            order.setTransactionType(toEntity(dto.getTransactionType()));
        }

        if (dto.getValueDetails() != null) {
            order.setValueDetails(toEntity(dto.getValueDetails()));
        }

        order.setVersion(dto.getVersion());

        return order;
    }

    public static BuyerInfo toEntity(BuyerDetailsDTO dto) {
        BuyerInfo entity = new BuyerInfo();
        entity.setLegalName(dto.getLegalName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setHouseNumber(dto.getHouseNumber());
        entity.setCity(dto.getCity());
        entity.setRegion(dto.getRegion());
        entity.setZone(dto.getZone());
        entity.setKebele(dto.getKebele());
        entity.setWereda(dto.getWereda());
        entity.setTin(dto.getTin());
        entity.setVatNumber(dto.getVatNumber());
        entity.setIdNumber(dto.getIdNumber());
        entity.setIdType(dto.getIdType());
        entity.setCountry(dto.getCountry());
        return entity;
    }

    public static DocumentDetails toEntity(DocumentDetailsDTO dto) {
        DocumentDetails entity = new DocumentDetails();
        entity.setDocumentNumber(dto.getDocumentNumber());
        entity.setDate(dto.getDate());
        entity.setType(dto.getType());
        return entity;
    }

    public static OrderItem toEntity(ItemDTO dto, Order order) {
        OrderItem entity = new OrderItem();
        entity.setItemCode(dto.getItemCode());
        entity.setProductDescription(dto.getProductDescription());
        entity.setUnitPrice(dto.getUnitPrice());
        entity.setPreTaxValue(dto.getPreTaxValue());
        entity.setTotalLineAmount(dto.getTotalLineAmount());
        entity.setTaxAmount(dto.getTaxAmount());
        entity.setDiscount(dto.getDiscount());
        entity.setExciseTaxValue(dto.getExciseTaxValue());
        entity.setQuantity(dto.getQuantity());
        entity.setLineNumber(dto.getLineNumber());
        entity.setNatureOfSupplies(dto.getNatureOfSupplies());
        entity.setTaxCode(dto.getTaxCode());
        entity.setHarmonizationCode(dto.getHarmonizationCode());
        entity.setUnit(dto.getUnit());
        entity.setOrder(order);
        return entity;
    }

    public static PaymentDetails toEntity(PaymentDetailsDTO dto) {
        PaymentDetails entity = new PaymentDetails();
        entity.setPaymentMode(dto.getPaymentMode());
        entity.setPaymentTerm(dto.getPaymentTerm());
        return entity;
    }

    public static ReferenceDetails toEntity(ReferenceDetailsDTO dto) {
        ReferenceDetails entity = new ReferenceDetails();
        entity.setPreviousIrn(dto.getPreviousIrn());
        entity.setRelatedDocument(dto.getRelatedDocument());
        return entity;
    }

    public static SellerInfo toEntity(SellerDetailsDTO dto) {
        SellerInfo entity = new SellerInfo();
        entity.setLegalName(dto.getLegalName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setHouseNumber(dto.getHouseNumber());
        entity.setCity(dto.getCity());
        entity.setRegion(dto.getRegion());
        entity.setSubCity(dto.getSubCity());
        entity.setTin(dto.getTin());
        entity.setVatNumber(dto.getVatNumber());
        entity.setWereda(dto.getWereda());
        entity.setLocality(dto.getLocality());
        return entity;
    }

    public static SourceSystem toEntity(SourceSystemDTO dto) {
        SourceSystem entity = new SourceSystem();
        entity.setCashierName(dto.getCashierName());
        entity.setInvoiceCounter(dto.getInvoiceCounter()); // int → Integer auto-boxing
        entity.setSalesPersonName(dto.getSalesPersonName());
        entity.setSystemNumber(dto.getSystemNumber());
        entity.setSystemType(dto.getSystemType());
        return entity;
    }

    public static TransactionType toEntity(String transactionType) {
        TransactionType entity = new TransactionType(); // use no-args constructor
        entity.setType(transactionType);
        return entity;
    }

    public static ValueDetails toEntity(ValueDetailsDTO dto) {
        ValueDetails entity = new ValueDetails();
        entity.setDiscount(dto.getDiscount());
        entity.setExciseValue(dto.getExciseValue());
        entity.setIncomeWithholdValue(dto.getIncomeWithholdValue());
        entity.setTaxValue(dto.getTaxValue());
        entity.setTotalValue(dto.getTotalValue());
        entity.setTransactionWithholdValue(dto.getTransactionWithholdValue());
        entity.setInvoiceCurrency(dto.getInvoiceCurrency());
        return entity;
    }

    // ================= ENTITY → DTO =================
    public static InvoiceRequestDTO toDto(Order order) {
        InvoiceRequestDTO dto = new InvoiceRequestDTO();

        if (order.getBuyerInfo() != null) {
            dto.setBuyerDetails(toDto(order.getBuyerInfo()));
        }

        if (order.getDocumentDetails() != null) {
            dto.setDocumentDetails(toDto(order.getDocumentDetails()));
        }

        if (order.getItems() != null) {
            List<ItemDTO> items = order.getItems().stream()
                    .map(InvoiceMapper::toDto)
                    .collect(Collectors.toList());
            dto.setItemList(items);
        }

        if (order.getPaymentDetails() != null) {
            dto.setPaymentDetails(toDto(order.getPaymentDetails()));
        }

        if (order.getReferenceDetails() != null) {
            dto.setReferenceDetails(toDto(order.getReferenceDetails()));
        }

        if (order.getSellerInfo() != null) {
            dto.setSellerDetails(toDto(order.getSellerInfo()));
        }

        if (order.getSourceSystem() != null) {
            dto.setSourceSystem(toDto(order.getSourceSystem()));
        }

        if (order.getTransactionType() != null) {
            dto.setTransactionType(order.getTransactionType().getType()); // correct
        }

        if (order.getValueDetails() != null) {
            dto.setValueDetails(toDto(order.getValueDetails()));
        }

        dto.setVersion(order.getVersion());
        return dto;
    }

    public static ItemDTO toDto(OrderItem entity) {
        ItemDTO dto = new ItemDTO();
        dto.setItemCode(entity.getItemCode());
        dto.setProductDescription(entity.getProductDescription());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setPreTaxValue(entity.getPreTaxValue());
        dto.setTotalLineAmount(entity.getTotalLineAmount());
        dto.setTaxAmount(entity.getTaxAmount());
        dto.setDiscount(entity.getDiscount());
        dto.setExciseTaxValue(entity.getExciseTaxValue());
        dto.setQuantity(entity.getQuantity());
        dto.setLineNumber(entity.getLineNumber());
        dto.setNatureOfSupplies(entity.getNatureOfSupplies());
        dto.setTaxCode(entity.getTaxCode());
        dto.setHarmonizationCode(entity.getHarmonizationCode());
        dto.setUnit(entity.getUnit());
        return dto;
    }

    public static ValueDetailsDTO toDto(ValueDetails entity) {
        ValueDetailsDTO dto = new ValueDetailsDTO();
        dto.setDiscount(entity.getDiscount());
        dto.setExciseValue(entity.getExciseValue());
        dto.setIncomeWithholdValue(entity.getIncomeWithholdValue());
        dto.setTaxValue(entity.getTaxValue());
        dto.setTotalValue(entity.getTotalValue());
        dto.setTransactionWithholdValue(entity.getTransactionWithholdValue());
        dto.setInvoiceCurrency(entity.getInvoiceCurrency());
        return dto;
    }

    public static BuyerDetailsDTO toDto(BuyerInfo entity) {
        BuyerDetailsDTO dto = new BuyerDetailsDTO();
        dto.setLegalName(entity.getLegalName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setHouseNumber(entity.getHouseNumber());
        dto.setCity(entity.getCity());
        dto.setRegion(entity.getRegion());
        dto.setZone(entity.getZone());
        dto.setKebele(entity.getKebele());
        dto.setWereda(entity.getWereda());
        dto.setTin(entity.getTin());
        dto.setVatNumber(entity.getVatNumber());
        dto.setIdNumber(entity.getIdNumber());
        dto.setIdType(entity.getIdType());
        dto.setCountry(entity.getCountry());
        return dto;
    }

    public static DocumentDetailsDTO toDto(DocumentDetails entity) {
        DocumentDetailsDTO dto = new DocumentDetailsDTO();
        dto.setDocumentNumber(entity.getDocumentNumber());
        dto.setDate(entity.getDate());
        dto.setType(entity.getType());
        return dto;
    }

    public static PaymentDetailsDTO toDto(PaymentDetails entity) {
        PaymentDetailsDTO dto = new PaymentDetailsDTO();
        dto.setPaymentMode(entity.getPaymentMode());
        dto.setPaymentTerm(entity.getPaymentTerm());
        return dto;
    }

    public static ReferenceDetailsDTO toDto(ReferenceDetails entity) {
        ReferenceDetailsDTO dto = new ReferenceDetailsDTO();
        dto.setPreviousIrn(entity.getPreviousIrn());
        dto.setRelatedDocument(entity.getRelatedDocument());
        return dto;
    }

    public static SellerDetailsDTO toDto(SellerInfo entity) {
        SellerDetailsDTO dto = new SellerDetailsDTO();
        dto.setLegalName(entity.getLegalName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setHouseNumber(entity.getHouseNumber());
        dto.setCity(entity.getCity());
        dto.setRegion(entity.getRegion());
        dto.setSubCity(entity.getSubCity());
        dto.setTin(entity.getTin());
        dto.setVatNumber(entity.getVatNumber());
        dto.setWereda(entity.getWereda());
        dto.setLocality(entity.getLocality());
        return dto;
    }

    public static SourceSystemDTO toDto(SourceSystem entity) {
        SourceSystemDTO dto = new SourceSystemDTO();
        dto.setCashierName(entity.getCashierName());
        dto.setInvoiceCounter(entity.getInvoiceCounter() != null ? entity.getInvoiceCounter() : 0);
        dto.setSalesPersonName(entity.getSalesPersonName());
        dto.setSystemNumber(entity.getSystemNumber());
        dto.setSystemType(entity.getSystemType());
        return dto;
    }
}
