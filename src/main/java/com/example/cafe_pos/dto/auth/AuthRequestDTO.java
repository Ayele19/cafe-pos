package com.example.cafe_pos.dto.auth;

public class AuthRequestDTO {

    private String clientId;
    private String clientSecret;
    private String apikey;
    private String tin;

    public AuthRequestDTO(String clientId, String clientSecret, String apikey, String tin) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.apikey = apikey;
        this.tin = tin;
    }

    public String getClientId() { return clientId; }
    public String getClientSecret() { return clientSecret; }
    public String getApikey() { return apikey; }
    public String getTin() { return tin; }

    public void setClientId(String clientId) { this.clientId = clientId; }
    public void setClientSecret(String clientSecret) { this.clientSecret = clientSecret; }
    public void setApikey(String apikey) { this.apikey = apikey; }
    public void setTin(String tin) { this.tin = tin; }
}
