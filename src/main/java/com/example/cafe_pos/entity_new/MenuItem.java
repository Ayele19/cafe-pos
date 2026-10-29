package com.example.cafe_pos.entity_new;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "menu_item")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private String category;
    private String unit;

    @Column(name = "image_url")
    private String imageUrl;

    // Empty = available to ALL branches. Non-empty = restricted to listed branches.
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "menu_item_source_system",
        joinColumns = @JoinColumn(name = "menu_item_id"),
        inverseJoinColumns = @JoinColumn(name = "source_system_id")
    )
    private List<SourceSystem> sourceSystems = new ArrayList<>();

    // ===== Getters & Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<SourceSystem> getSourceSystems() { return sourceSystems; }
    public void setSourceSystems(List<SourceSystem> sourceSystems) { this.sourceSystems = sourceSystems; }
}
