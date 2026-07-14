package com.example.cafe_pos.service;

import com.example.cafe_pos.dto.auth.AuthRequestDTO;
import com.example.cafe_pos.dto.auth.AuthResponseDTO;
import com.example.cafe_pos.dto.external.ExternalInvoiceDTO;
import com.example.cafe_pos.entity_new.TaxApiToken;
import com.example.cafe_pos.repository.TaxApiTokenRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class TaxApiService {

    @Value("${taxapi.clientId}") private String clientId;
    @Value("${taxapi.clientSecret}") private String clientSecret;
    @Value("${taxapi.apiKey}") private String apiKey;
    @Value("${taxapi.taxpayerTin}") private String taxpayerTin;
    @Value("${tax.api.authUrl}") private String authUrl;
    @Value("${tax.api.url}") private String apiUrl;
    @Value("${tax.api.refreshTokenUrl}") private String refreshTokenUrl;

    @Autowired
    private TaxApiTokenRepository tokenRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String accessToken;
    private String refreshToken;
    private Instant tokenExpiry;

    // -------------------- Load token from DB --------------------
    private void loadTokenFromDB() {
        tokenRepository.findAll().stream().findFirst().ifPresent(token -> {
            this.accessToken = token.getAccessToken();
            this.refreshToken = token.getRefreshToken();
        });
    }

    // -------------------- Save token to DB --------------------
    private void saveTokenToDB(String accessToken, String refreshToken) {
        TaxApiToken token = tokenRepository.findAll().stream().findFirst().orElse(new TaxApiToken());
        token.setAccessToken(accessToken);
        token.setRefreshToken(refreshToken);
        tokenRepository.save(token);
    }

    // -------------------- Authenticate / Login --------------------
    public void authenticate() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        AuthRequestDTO authRequest = new AuthRequestDTO(clientId, clientSecret, apiKey, taxpayerTin);
        HttpEntity<AuthRequestDTO> request = new HttpEntity<>(authRequest, headers);

        ResponseEntity<AuthResponseDTO> response = restTemplate.postForEntity(authUrl, request, AuthResponseDTO.class);

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && "SUCCESS".equals(response.getBody().getStatus())) {

            this.accessToken = response.getBody().getData().getAccessToken();
            this.refreshToken = response.getBody().getData().getRefreshToken();
            saveTokenToDB(accessToken, refreshToken);

        } else {
            throw new RuntimeException("Failed to authenticate with Tax API");
        }
    }

    // -------------------- Refresh Access Token --------------------
    public void refreshAccessToken() {
        if (refreshToken == null) loadTokenFromDB();
        if (refreshToken == null) {
            System.out.println("⚠️ No refresh token found, re-authenticating...");
            authenticate();
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("refreshToken", refreshToken);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<AuthResponseDTO> response = restTemplate.postForEntity(refreshTokenUrl, request, AuthResponseDTO.class);

            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null
                    && "SUCCESS".equals(response.getBody().getStatus())) {

                this.accessToken = response.getBody().getData().getAccessToken();
                this.refreshToken = response.getBody().getData().getRefreshToken();
                saveTokenToDB(accessToken, refreshToken);

            } else {
                System.out.println("⚠️ Refresh token invalid, re-authenticating...");
                authenticate();
            }

        } catch (HttpClientErrorException.Unauthorized e) {
            System.out.println("⚠️ Refresh token unauthorized, re-authenticating...");
            authenticate();
        }
    }

    // -------------------- Send Invoice --------------------
    public String sendInvoice(ExternalInvoiceDTO externalDTO) throws JsonProcessingException {
        if (accessToken == null) loadTokenFromDB();
        if (accessToken == null) authenticate();

        return sendInvoiceRequest(externalDTO);
    }

    // -------------------- Send Invoice Request --------------------
    private String sendInvoiceRequest(ExternalInvoiceDTO dto) throws JsonProcessingException {
        String invoiceJson = objectMapper.writeValueAsString(dto);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken); // ✅ add token header

        HttpEntity<String> request = new HttpEntity<>(invoiceJson, headers);
        ResponseEntity<String> response;

        try {
            response = restTemplate.postForEntity(apiUrl, request, String.class);
        } catch (HttpClientErrorException.Unauthorized e) {
            // Token might be expired → refresh or re-authenticate
            refreshAccessToken();
            headers.setBearerAuth(accessToken);
            request = new HttpEntity<>(invoiceJson, headers);
            response = restTemplate.postForEntity(apiUrl, request, String.class);
        }

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new RuntimeException("Invoice registration failed with status: "
                    + response.getStatusCode() + " and body: " + response.getBody());
        }
    }
}
