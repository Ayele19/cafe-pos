package com.example.cafe_pos.mapper;

import com.example.cafe_pos.entity_new.*;
import com.example.cafe_pos.dto.external.*;
import java.util.stream.Collectors;

public class ExternalInvoiceMapper {

    // ================= ENTITY → EXTERNAL DTO =================
    public static ExternalInvoiceDTO toExternalInvoiceDTO(Order order) {
        ExternalInvoiceDTO dto = new ExternalInvoiceDTO();

        if (order.getBuyerInfo() != null)
            dto.setBuyerDetails(toExternalBuyerDetailsDTO(order.getBuyerInfo()));

        if (order.getSellerInfo() != null)
            dto.setSellerDetails(toExternalSellerDetailsDTO(order.getSellerInfo()));

        if (order.getDocumentDetails() != null)
            dto.setDocumentDetails(toExternalDocumentDetailsDTO(order.getDocumentDetails()));

        if (order.getItems() != null)
            dto.setItemList(order.getItems().stream()
                    .map(ExternalInvoiceMapper::toExternalItemDTO)
                    .collect(Collectors.toList()));

        if (order.getPaymentDetails() != null)
            dto.setPaymentDetails(toExternalPaymentDetailsDTO(order.getPaymentDetails()));

        if (order.getReferenceDetails() != null)
            dto.setReferenceDetails(toExternalReferenceDetailsDTO(order.getReferenceDetails()));

        if (order.getSourceSystem() != null)
            dto.setSourceSystem(toExternalSourceSystemDTO(order.getSourceSystem()));

        if (order.getValueDetails() != null)
            dto.setValueDetails(toExternalValueDTO(order.getValueDetails()));

        dto.setTransactionType(order.getTransactionType().getType());
        dto.setVersion("1");

        return dto;
    }

    // ================= ENTITY → SUB-DTO HELPERS =================
    public static ExternalBuyerDetailsDTO toExternalBuyerDetailsDTO(BuyerInfo entity) {
        ExternalBuyerDetailsDTO dto = new ExternalBuyerDetailsDTO();
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

    public static ExternalSellerDetailsDTO toExternalSellerDetailsDTO(SellerInfo entity) {
        ExternalSellerDetailsDTO dto = new ExternalSellerDetailsDTO();
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

    public static ExternalDocumentDetailsDTO toExternalDocumentDetailsDTO(DocumentDetails entity) {
        ExternalDocumentDetailsDTO dto = new ExternalDocumentDetailsDTO();

        // ✅ EXACTLY match DB value
        dto.setDocumentNumber(entity.getDocumentNumber());

        dto.setDate(entity.getDate());
        dto.setType(entity.getType());
        return dto;
    }

    public static ExternalItemDTO toExternalItemDTO(OrderItem entity) {
        ExternalItemDTO dto = new ExternalItemDTO();
        dto.setItemCode(entity.getItemCode());
        dto.setProductDescription(entity.getProductDescription());
        dto.setUnitPrice(entity.getUnitPrice().doubleValue());
        dto.setPreTaxValue(entity.getPreTaxValue().doubleValue());
        dto.setTotalLineAmount(entity.getTotalLineAmount().doubleValue());
        dto.setTaxAmount(entity.getTaxAmount().doubleValue());
        dto.setDiscount(entity.getDiscount() != null ? entity.getDiscount().doubleValue() : 0.0);
        dto.setExciseTaxValue(entity.getExciseTaxValue() != null ? entity.getExciseTaxValue().doubleValue() : 0.0);
        dto.setQuantity(entity.getQuantity());
        dto.setLineNumber(entity.getLineNumber());
        dto.setNatureOfSupplies(entity.getNatureOfSupplies());
        dto.setTaxCode(entity.getTaxCode());
        dto.setHarmonizationCode(entity.getHarmonizationCode());
        dto.setUnit(entity.getUnit());
        return dto;
    }

    public static ExternalPaymentDetailsDTO toExternalPaymentDetailsDTO(PaymentDetails entity) {
        ExternalPaymentDetailsDTO dto = new ExternalPaymentDetailsDTO();
        dto.setMode(entity.getPaymentMode());
        dto.setPaymentTerm(entity.getPaymentTerm());
        return dto;
    }

    public static ExternalReferenceDetailsDTO toExternalReferenceDetailsDTO(ReferenceDetails entity) {
        ExternalReferenceDetailsDTO dto = new ExternalReferenceDetailsDTO();
        dto.setPreviousIrn(entity.getPreviousIrn());
        dto.setRelatedDocument(entity.getRelatedDocument());
        return dto;
    }

    public static ExternalSourceSystemDTO toExternalSourceSystemDTO(SourceSystem entity) {
        ExternalSourceSystemDTO dto = new ExternalSourceSystemDTO();
        dto.setCashierName(entity.getCashierName());

        // ✅ Send EXACT invoiceCounter from DB without modification
     dto.setInvoiceCounter(String.valueOf(entity.getInvoiceCounter())); // ✅ converts Integer → String


        dto.setSalesPersonName(entity.getSalesPersonName());
        dto.setSystemNumber(entity.getSystemNumber());
        dto.setSystemType(entity.getSystemType());
        return dto;
    }

    public static ExternalValueDetailsDTO toExternalValueDTO(ValueDetails entity) {
        ExternalValueDetailsDTO dto = new ExternalValueDetailsDTO();
        dto.setDiscount(entity.getDiscount() != null ? entity.getDiscount().doubleValue() : null);
        dto.setExciseValue(entity.getExciseValue() != null ? entity.getExciseValue().doubleValue() : 0.0);
        dto.setIncomeWithholdValue(entity.getIncomeWithholdValue() != null ? entity.getIncomeWithholdValue().doubleValue() : 0.0);
        dto.setTaxValue(entity.getTaxValue() != null ? entity.getTaxValue().doubleValue() : 0.0);
        dto.setTotalValue(entity.getTotalValue() != null ? entity.getTotalValue().doubleValue() : 0.0);
        dto.setTransactionWithholdValue(entity.getTransactionWithholdValue() != null ? entity.getTransactionWithholdValue().doubleValue() : 0.0);
        dto.setInvoiceCurrency(entity.getInvoiceCurrency());
        return dto;
    }
}
