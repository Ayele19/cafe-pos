package com.example.cafe_pos.entity_new;

import jakarta.persistence.*;

@Entity
@Table(name = "cashier")
public class Cashier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    private String displayName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "source_system_id", nullable = false)
    private SourceSystem sourceSystem;

    private boolean active = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public SourceSystem getSourceSystem() { return sourceSystem; }
    public void setSourceSystem(SourceSystem sourceSystem) { this.sourceSystem = sourceSystem; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
