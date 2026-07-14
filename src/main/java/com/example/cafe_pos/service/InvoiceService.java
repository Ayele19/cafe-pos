package com.example.cafe_pos.service;

import com.example.cafe_pos.dto.InvoiceRequestDTO;
import com.example.cafe_pos.entity_new.Order;
import com.example.cafe_pos.mapper.InvoiceMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class InvoiceService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${tax.api.url}")
    private String invoiceApiUrl;

    @Value("${taxapi.clientId}")
    private String clientId;

    @Value("${taxapi.clientSecret}")
    private String clientSecret;

    @Value("${taxapi.apiKey}")
    private String apiKey;

    @Value("${taxapi.taxpayerTin}")
    private String taxpayerTin;

    public InvoiceService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();
    }

    public String sendInvoice(Order order) {
        try {
            // 1️⃣ Convert Order → DTO
            InvoiceRequestDTO invoiceDTO = InvoiceMapper.toDto(order);

            // 2️⃣ Convert DTO → JSON string (optional logging)
            String json = objectMapper.writeValueAsString(invoiceDTO);
            System.out.println("Invoice JSON: " + json);

            // 3️⃣ Prepare HTTP headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("clientId", clientId);
            headers.set("clientSecret", clientSecret);
            headers.set("apiKey", apiKey);
            headers.set("taxpayerTin", taxpayerTin);

            HttpEntity<InvoiceRequestDTO> request = new HttpEntity<>(invoiceDTO, headers);

            // 4️⃣ Send POST request
            ResponseEntity<String> response = restTemplate.exchange(
                    invoiceApiUrl,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            return response.getBody();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
