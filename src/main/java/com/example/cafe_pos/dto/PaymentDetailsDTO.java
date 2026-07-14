package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PaymentDetailsDTO {

    @JsonProperty("Mode")
    private String paymentMode;

    @JsonProperty("PaymentTerm")
    private String paymentTerm;

    // ================= Getters & Setters =================
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }

    public String getPaymentTerm() { return paymentTerm; }
    public void setPaymentTerm(String paymentTerm) { this.paymentTerm = paymentTerm; }
}
