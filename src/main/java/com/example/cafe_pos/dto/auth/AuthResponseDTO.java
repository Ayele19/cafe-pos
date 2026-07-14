package com.example.cafe_pos.dto.auth;

public class AuthResponseDTO {

    private Data data;
    private String status;

    public Data getData() { return data; }
    public void setData(Data data) { this.data = data; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public static class Data {
        private String accessToken;
        private String refreshToken;
        private String encryptionKey;
        private Long expiresIn;

        public String getAccessToken() { return accessToken; }
        public void setAccessToken(String accessToken) { this.accessToken = accessToken; }
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
        public String getEncryptionKey() { return encryptionKey; }
        public void setEncryptionKey(String encryptionKey) { this.encryptionKey = encryptionKey; }
        public Long getExpiresIn() { return expiresIn; }
        public void setExpiresIn(Long expiresIn) { this.expiresIn = expiresIn; }
    }
}
