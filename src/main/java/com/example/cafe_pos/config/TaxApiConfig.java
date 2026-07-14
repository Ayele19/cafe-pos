package com.example.cafe_pos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TaxApiConfig {

    @Value("${TAXAPI_CLIENT_ID}")
    private String clientId;

    @Value("${TAXAPI_CLIENT_SECRET}")
    private String clientSecret;

    @Value("${TAXAPI_API_KEY}")
    private String apiKey;

    @Value("${TAXAPI_TAXPAYER_TIN}")
    private String taxpayerTin;

    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getApiKey() { return apiKey; }
    public String getTaxpayerTin() { return taxpayerTin; }
}
