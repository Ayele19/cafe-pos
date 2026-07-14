package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalPaymentDetailsDTO {

    @JsonProperty("Mode")
    private String mode;

    @JsonProperty("PaymentTerm")
    private String paymentTerm;

    // Getters & Setters
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getPaymentTerm() { return paymentTerm; }
    public void setPaymentTerm(String paymentTerm) { this.paymentTerm = paymentTerm; }
}
