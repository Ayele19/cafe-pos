package com.example.cafe_pos.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ExternalBuyerDetailsDTO {

    @JsonProperty("Tin")
    private String tin;

    @JsonProperty("VatNumber")
    private String vatNumber;

    @JsonProperty("LegalName")
    private String legalName;

    @JsonProperty("Country")
    private String country;

    @JsonProperty("Region")
    private String region;

    @JsonProperty("City")
    private String city;

    @JsonProperty("HouseNumber")
    private String houseNumber;

    @JsonProperty("Kebele")
    private String kebele;

    @JsonProperty("Wereda")
    private String wereda;

    @JsonProperty("Zone")
    private String zone;

    @JsonProperty("IdType")
    private String idType;

    @JsonProperty("IdNumber")
    private String idNumber;

    @JsonProperty("Email")
    private String email;

    @JsonProperty("Phone")
    private String phone;

    // Getters & Setters
    public String getTin() { return tin; }
    public void setTin(String tin) { this.tin = tin; }

    public String getVatNumber() { return vatNumber; }
    public void setVatNumber(String vatNumber) { this.vatNumber = vatNumber; }

    public String getLegalName() { return legalName; }
    public void setLegalName(String legalName) { this.legalName = legalName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getHouseNumber() { return houseNumber; }
    public void setHouseNumber(String houseNumber) { this.houseNumber = houseNumber; }

    public String getKebele() { return kebele; }
    public void setKebele(String kebele) { this.kebele = kebele; }

    public String getWereda() { return wereda; }
    public void setWereda(String wereda) { this.wereda = wereda; }

    public String getZone() { return zone; }
    public void setZone(String zone) { this.zone = zone; }

    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
