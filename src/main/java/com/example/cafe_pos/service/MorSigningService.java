package com.example.cafe_pos.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class MorSigningService {

    private static final Logger log = Logger.getLogger(MorSigningService.class.getName());

    @Value("${taxapi.privateKeyPath}")
    private String privateKeyPath;

    @Value("${taxapi.certificate}")
    private String certificate;

    private PrivateKey cachedKey = null;

    // ── Load private key ──
    private PrivateKey loadPrivateKey() throws Exception {
        if (cachedKey != null) return cachedKey;

        log.info("Loading private key from: " + privateKeyPath);

        if (privateKeyPath == null || privateKeyPath.isBlank())
            throw new RuntimeException("taxapi.privateKeyPath is not configured");

        File keyFile = new File(privateKeyPath);
        if (!keyFile.exists())
            throw new RuntimeException("Private key file not found: " + privateKeyPath);

        String pem = new String(Files.readAllBytes(Paths.get(privateKeyPath)), StandardCharsets.UTF_8);

        String base64 = pem
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                .replace("-----END RSA PRIVATE KEY-----", "")
                .replaceAll("\\s+", "");

        if (base64.isBlank())
            throw new RuntimeException("Private key file is empty after stripping PEM headers: " + privateKeyPath);

        byte[] keyBytes = Base64.getDecoder().decode(base64);
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(keyBytes);
        cachedKey = KeyFactory.getInstance("RSA").generatePrivate(spec);
        log.info("Private key loaded successfully from: " + privateKeyPath);
        return cachedKey;
    }

    // ── Sign payload ──
    public String sign(String payloadJson) {
        try {
            PrivateKey key = loadPrivateKey();

            Signature sig = Signature.getInstance("SHA512withRSA");
            sig.initSign(key);
            sig.update(payloadJson.getBytes(StandardCharsets.UTF_8));
            byte[] signedBytes = sig.sign();

            // Use 64-char line breaks — matches openssl base64 output
            String result = Base64.getMimeEncoder(64, new byte[]{'\n'}).encodeToString(signedBytes);
            log.info("Payload signed. Signature length=" + result.length() + " first40=" + result.substring(0, Math.min(40, result.length())));
            return result;
        } catch (Exception e) {
            log.severe("SIGNING FAILED: " + e.getMessage());
            throw new RuntimeException("Failed to sign MOR payload: " + e.getMessage(), e);
        }
    }

    // ── Build signed envelope ──
    public <T> Map<String, Object> buildSignedRequest(T requestBody) {
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String payloadJson = mapper.writeValueAsString(requestBody);
            log.info("MOR payload: " + payloadJson);

            String signature = sign(payloadJson);

            log.info("Full envelope signature field length: " + (signature != null ? signature.length() : "NULL"));

            Map<String, Object> envelope = new LinkedHashMap<>();
            envelope.put("request",     requestBody);
            envelope.put("signature",   signature);
            envelope.put("certificate", certificate);

            // Log full envelope JSON for debugging
            try {
                log.info("Full MOR envelope: " + mapper.writeValueAsString(envelope));
            } catch (Exception ignored) {}

            return envelope;
        } catch (Exception e) {
            throw new RuntimeException("Failed to build signed MOR request: " + e.getMessage(), e);
        }
    }

    public String getCertificate() { return certificate; }
}
