package com.example.cafe_pos.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SellerDetailsDTO {

    @JsonProperty("Tin")
    private String tin;

    @JsonProperty("LegalName")
    private String legalName;

    @JsonProperty("Email")
    private String email;

    @JsonProperty("Phone")
    private String phone;

    @JsonProperty("VatNumber")
    private String vatNumber;

    @JsonProperty("City")
    private String city;

    @JsonProperty("Region")
    private String region;

    @JsonProperty("Wereda")
    private String wereda;

    @JsonProperty("SubCity")
    private String subCity;

    @JsonProperty("HouseNumber")
    private String houseNumber;

    @JsonProperty("Locality")
    private String locality;

    // --- getters & setters ---
    public String getTin() { return tin; }
    public void setTin(String tin) { this.tin = tin; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVatNumber() { return vatNumber; }
    public void setVatNumber(String vatNumber) { this.vatNumber = vatNumber; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getWereda() { return wereda; }
    public void setWereda(String wereda) { this.wereda = wereda; }

    public String getSubCity() { return subCity; }
    public void setSubCity(String subCity) { this.subCity = subCity; }

    public String getHouseNumber() { return houseNumber; }
    public void setHouseNumber(String houseNumber) { this.houseNumber = houseNumber; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }
}
