package com.example.cafe_pos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TaxVerificationService {

    @Value("${tax.api.verification}")
    private String verificationUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final TaxApiService taxApiService;

    public TaxVerificationService(TaxApiService taxApiService) {
        this.taxApiService = taxApiService;
    }

    public String verifyByIrn(String irn) {

        // -------------------- Build headers --------------------
        HttpHeaders headers = new HttpHeaders();
        // Directly access the token field (private, so use reflection or create getter in service)
        String token = null;
        try {
            java.lang.reflect.Field field = TaxApiService.class.getDeclaredField("accessToken");
            field.setAccessible(true);
            token = (String) field.get(taxApiService);
        } catch (Exception e) {
            // If token is null, authenticate
            taxApiService.authenticate();
            try {
                java.lang.reflect.Field field = TaxApiService.class.getDeclaredField("accessToken");
                field.setAccessible(true);
                token = (String) field.get(taxApiService);
            } catch (Exception ex) {
                throw new RuntimeException("Unable to get access token", ex);
            }
        }

        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        // -------------------- Body --------------------
        Map<String, String> body = new HashMap<>();
        body.put("irn", irn);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        // -------------------- Send request --------------------
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(verificationUrl, request, String.class);
            return response.getBody();
        } catch (HttpClientErrorException.Unauthorized e) {
            // token expired → refresh
            taxApiService.refreshAccessToken();
            try {
                java.lang.reflect.Field field = TaxApiService.class.getDeclaredField("accessToken");
                field.setAccessible(true);
                token = (String) field.get(taxApiService);
            } catch (Exception ex) {
                throw new RuntimeException("Unable to get refreshed token", ex);
            }

            headers.setBearerAuth(token);
            request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(verificationUrl, request, String.class);
            return response.getBody();
        }
    }
}
