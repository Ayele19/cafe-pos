package com.example.cafe_pos.dto;

public class SellerDetailsDTO {

    private Long id;
    private String tin;
    private String legalName;
    private String email;
    private String phone;
    private String vatNumber;
    private String city;
    private String region;
    private String wereda;
    private String subCity;
    private String houseNumber;
    private String locality;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
