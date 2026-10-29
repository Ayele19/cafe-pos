package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.MenuItem;
import com.example.cafe_pos.entity_new.SourceSystem;
import com.example.cafe_pos.entity_new.Cashier;
import com.example.cafe_pos.repository.CashierRepository;
import com.example.cafe_pos.repository.MenuItemRepository;
import com.example.cafe_pos.repository.SourceSystemRepository;
import com.example.cafe_pos.security.Permission;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    private final MenuItemRepository menuItemRepository;
    private final CashierRepository cashierRepository;
    private final SourceSystemRepository sourceSystemRepository;

    public MenuController(MenuItemRepository menuItemRepository,
                          CashierRepository cashierRepository,
                          SourceSystemRepository sourceSystemRepository) {
        this.menuItemRepository = menuItemRepository;
        this.cashierRepository = cashierRepository;
        this.sourceSystemRepository = sourceSystemRepository;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + Permission.MENU_READ + "')")
    public List<Map<String, Object>> getAllMenuItems(JwtAuthenticationToken authentication) {
        String username = authentication.getToken().getClaimAsString("preferred_username");
        Cashier cashier = cashierRepository.findByUsername(username).orElse(null);

        List<MenuItem> all = menuItemRepository.findAll();
        List<MenuItem> filtered;

        if (cashier == null) {
            filtered = all;
        } else {
            Long branchId = cashier.getSourceSystem().getId();
            filtered = all.stream()
                    .filter(item -> item.getSourceSystems().isEmpty()
                            || item.getSourceSystems().stream().anyMatch(s -> s.getId().equals(branchId)))
                    .collect(Collectors.toList());
        }

        return filtered.stream().map(item -> {
            Map<String, Object> m = new java.util.LinkedHashMap<>();
            m.put("id", item.getId());
            m.put("name", item.getName());
            m.put("price", item.getPrice());
            m.put("category", item.getCategory());
            m.put("unit", item.getUnit());
            m.put("imageUrl", item.getImageUrl());
            m.put("sourceSystems", item.getSourceSystems().stream().map(ss -> {
                Map<String, Object> b = new java.util.LinkedHashMap<>();
                b.put("id", ss.getId());
                b.put("systemNumber", ss.getSystemNumber());
                b.put("branchName", ss.getBranchName());
                return b;
            }).collect(Collectors.toList()));
            return m;
        }).collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + Permission.MENU_WRITE + "')")
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody Map<String, Object> body) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName((String) body.get("name"));
        menuItem.setCategory((String) body.get("category"));
        menuItem.setPrice(Double.parseDouble(body.get("price").toString()));
        menuItem.setUnit(body.get("unit") != null ? (String) body.get("unit") : "PCS");

        // Assign to specific branches or all
        @SuppressWarnings("unchecked")
        List<Integer> branchIds = (List<Integer>) body.get("sourceSystemIds");
        if (branchIds != null && !branchIds.isEmpty()) {
            List<SourceSystem> branches = branchIds.stream()
                    .map(id -> sourceSystemRepository.findById(Long.valueOf(id))
                            .orElseThrow(() -> new RuntimeException("Branch not found: " + id)))
                    .collect(Collectors.toList());
            menuItem.setSourceSystems(branches);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(menuItemRepository.save(menuItem));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.MENU_WRITE + "')")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id,
                                                   @RequestBody Map<String, Object> body) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (body.containsKey("name")) item.setName((String) body.get("name"));
        if (body.containsKey("price")) item.setPrice(Double.parseDouble(body.get("price").toString()));
        if (body.containsKey("category")) item.setCategory((String) body.get("category"));
        if (body.containsKey("unit") && body.get("unit") != null) item.setUnit((String) body.get("unit"));

        @SuppressWarnings("unchecked")
        List<Integer> branchIds = (List<Integer>) body.get("sourceSystemIds");
        if (branchIds != null) {
            if (branchIds.isEmpty()) {
                item.setSourceSystems(new ArrayList<>());
            } else {
                List<SourceSystem> branches = branchIds.stream()
                        .map(bid -> sourceSystemRepository.findById(Long.valueOf(bid))
                                .orElseThrow(() -> new RuntimeException("Branch not found: " + bid)))
                        .collect(Collectors.toList());
                item.setSourceSystems(branches);
            }
        }

        return ResponseEntity.ok(menuItemRepository.save(item));
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasAuthority('" + Permission.MENU_WRITE + "')")
    public ResponseEntity<?> uploadMenuItemImage(@PathVariable Long id,
                                                  @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) return ResponseEntity.badRequest().body("File is empty");

            MenuItem item = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
            String fileName = UUID.randomUUID() + "_" + original.replaceAll("[^a-zA-Z0-9._-]", "_");

            Path uploadPath = Paths.get("uploads/menu");
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), uploadPath.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);

            item.setImageUrl("/images/menu/" + fileName);
            menuItemRepository.save(item);

            return ResponseEntity.ok("http://localhost:8080" + item.getImageUrl());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + Permission.MENU_WRITE + "')")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
