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

import java.util.Map;

/**
 * Communicates with MOR HTTPS API.
 * Every request is signed with SHA512withRSA via MorSigningService.
 *
 * Request envelope:
 * {
 *   "request": { ...actual payload... },
 *   "signature": "<base64 SHA512withRSA signature of JSON(request)>",
 *   "certificate": "<base64 certificate>"
 * }
 */
@Service
public class TaxApiService {

    @Value("${taxapi.clientId}")    private String clientId;
    @Value("${taxapi.clientSecret}") private String clientSecret;
    @Value("${taxapi.apiKey}")       private String apiKey;
    @Value("${taxapi.taxpayerTin}")  private String taxpayerTin;
    @Value("${tax.api.authUrl}")     private String authUrl;
    @Value("${tax.api.url}")         private String apiUrl;
    @Value("${tax.api.refreshTokenUrl}") private String refreshTokenUrl;

    @Autowired private TaxApiTokenRepository tokenRepository;
    @Autowired private MorSigningService signingService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private String accessToken;
    private String refreshToken;

    // ── Token persistence ──
    private void loadTokenFromDB() {
        tokenRepository.findAll().stream().findFirst().ifPresent(t -> {
            this.accessToken  = t.getAccessToken();
            this.refreshToken = t.getRefreshToken();
        });
    }

    private void saveTokenToDB(String access, String refresh) {
        TaxApiToken token = tokenRepository.findAll().stream().findFirst().orElse(new TaxApiToken());
        token.setAccessToken(access);
        token.setRefreshToken(refresh);
        tokenRepository.save(token);
    }

    // ── Authentication ──
    public void authenticate() {
        AuthRequestDTO authRequest = new AuthRequestDTO(clientId, clientSecret, apiKey, taxpayerTin);

        // Sign the auth request payload
        Map<String, Object> envelope = signingService.buildSignedRequest(authRequest);

        org.slf4j.LoggerFactory.getLogger(TaxApiService.class)
            .info("Auth envelope signature field: {}",
                envelope.get("signature") != null ? "present (" + envelope.get("signature").toString().length() + " chars)" : "NULL/MISSING");
        org.slf4j.LoggerFactory.getLogger(TaxApiService.class)
            .info("Auth envelope certificate field: {}",
                envelope.get("certificate") != null ? "present (" + envelope.get("certificate").toString().length() + " chars)" : "NULL/MISSING");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(envelope, headers);

        ResponseEntity<AuthResponseDTO> response = restTemplate.postForEntity(authUrl, request, AuthResponseDTO.class);

        if (response.getStatusCode() == HttpStatus.OK
                && response.getBody() != null
                && "SUCCESS".equals(response.getBody().getStatus())) {
            this.accessToken  = response.getBody().getData().getAccessToken();
            this.refreshToken = response.getBody().getData().getRefreshToken();
            saveTokenToDB(accessToken, refreshToken);
        } else {
            throw new RuntimeException("Failed to authenticate with MOR API");
        }
    }

    // ── Refresh token ──
    public void refreshAccessToken() {
        if (refreshToken == null) loadTokenFromDB();
        if (refreshToken == null || refreshToken.isBlank()) {
            // No refresh token available — re-authenticate from scratch
            authenticate();
            return;
        }

        Map<String, String> body = Map.of("refreshToken", refreshToken);
        Map<String, Object> envelope = signingService.buildSignedRequest(body);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(envelope, headers);

        try {
            ResponseEntity<AuthResponseDTO> response = restTemplate.postForEntity(refreshTokenUrl, request, AuthResponseDTO.class);
            if (response.getStatusCode() == HttpStatus.OK
                    && response.getBody() != null
                    && "SUCCESS".equals(response.getBody().getStatus())) {
                this.accessToken  = response.getBody().getData().getAccessToken();
                this.refreshToken = response.getBody().getData().getRefreshToken();
                saveTokenToDB(accessToken, refreshToken);
            } else {
                // Refresh failed — re-authenticate
                authenticate();
            }
        } catch (HttpClientErrorException.Unauthorized e) {
            authenticate();
        } catch (HttpClientErrorException e) {
            // Any 4xx on refresh (including null refreshToken) — re-authenticate
            authenticate();
        }
    }

    // ── Send invoice ──
    public String sendInvoice(ExternalInvoiceDTO dto) throws JsonProcessingException {
        if (accessToken == null) loadTokenFromDB();
        if (accessToken == null) authenticate();
        return sendInvoiceRequest(dto);
    }

    private String sendInvoiceRequest(ExternalInvoiceDTO dto) throws JsonProcessingException {
        // Sign the invoice payload
        Map<String, Object> envelope = signingService.buildSignedRequest(dto);
        String envelopeJson = objectMapper.writeValueAsString(envelope);

        // Log what we're actually sending
        org.slf4j.LoggerFactory.getLogger(TaxApiService.class)
            .info("Sending to MOR register. Envelope signature field: {}",
                envelope.get("signature") != null ? "present (" + envelope.get("signature").toString().length() + " chars)" : "NULL/MISSING");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);
        HttpEntity<String> request = new HttpEntity<>(envelopeJson, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            if (response.getStatusCode() == HttpStatus.OK) return response.getBody();
            throw new RuntimeException("Invoice registration failed: " + response.getStatusCode());
        } catch (HttpClientErrorException.Unauthorized e) {
            refreshAccessToken();
            headers.setBearerAuth(accessToken);
            request = new HttpEntity<>(envelopeJson, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            return response.getBody();
        }
    }
}
