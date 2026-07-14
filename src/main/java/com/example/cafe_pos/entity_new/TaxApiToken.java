package com.example.cafe_pos.entity_new;

import jakarta.persistence.*;

@Entity
@Table(name = "tax_api_tokens")
public class TaxApiToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;

    @Lob
    @Column(name = "refresh_token", columnDefinition = "TEXT")
    private String refreshToken;

    private Long expiresAt;

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

    public Long getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Long expiresAt) { this.expiresAt = expiresAt; }
}
