package com.example.cafe_pos.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class TaxVerificationService {

    @Value("${tax.api.verification}")
    private String verificationUrl;

    @Value("${tax.api.cancelUrl:}")
    private String cancelUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final TaxApiService taxApiService;

    @Autowired
    private MorSigningService signingService;

    public TaxVerificationService(TaxApiService taxApiService) {
        this.taxApiService = taxApiService;
    }

    public String verifyByIrn(String irn) {
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("irn", irn);

        Map<String, Object> envelope = signingService.buildSignedRequest(payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(envelope, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(verificationUrl, request, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            // MOR returns 400 for cancelled invoices — return body as-is
            return e.getResponseBodyAsString();
        }
    }

    public String cancelByIrn(String irn, String reasonCode, String remark) {
        String url = (cancelUrl != null && !cancelUrl.isBlank())
                ? cancelUrl
                : verificationUrl.replace("/verify", "/cancel");

        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("Irn", irn);
        payload.put("ReasonCode", reasonCode);
        payload.put("Remark", remark != null ? remark : "");

        Map<String, Object> envelope = signingService.buildSignedRequest(payload);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(getToken());
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(envelope, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.Unauthorized e) {
            taxApiService.refreshAccessToken();
            headers.setBearerAuth(getToken());
            request = new HttpEntity<>(envelope, headers);
            return restTemplate.postForEntity(url, request, String.class).getBody();
        }
    }

    private String getToken() {
        try {
            java.lang.reflect.Field field = TaxApiService.class.getDeclaredField("accessToken");
            field.setAccessible(true);
            String token = (String) field.get(taxApiService);
            if (token == null) {
                taxApiService.authenticate();
                token = (String) field.get(taxApiService);
            }
            return token;
        } catch (Exception e) {
            throw new RuntimeException("Unable to get access token", e);
        }
    }
}
