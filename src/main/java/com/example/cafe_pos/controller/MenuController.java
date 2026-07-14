package com.example.cafe_pos.controller;

import com.example.cafe_pos.entity_new.MenuItem;
import com.example.cafe_pos.repository.MenuItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin
public class MenuController {

    private final MenuItemRepository menuItemRepository;

    public MenuController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // 🔹 GET ALL MENU ITEMS
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // 🔹 CREATE NEW MENU ITEM
    @PostMapping
    public ResponseEntity<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {

        if (menuItem.getUnit() == null || menuItem.getUnit().isBlank()) {
            menuItem.setUnit("PCS");
        }

        MenuItem saved = menuItemRepository.save(menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 🔹 UPDATE MENU ITEM FIELDS ONLY (name, price, category, unit)
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id,
            @RequestBody MenuItem menuItem) {

        MenuItem existingItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        existingItem.setName(menuItem.getName());
        existingItem.setPrice(menuItem.getPrice());
        existingItem.setCategory(menuItem.getCategory());

        if (menuItem.getUnit() != null && !menuItem.getUnit().isBlank()) {
            existingItem.setUnit(menuItem.getUnit());
        }

        MenuItem updated = menuItemRepository.save(existingItem);
        return ResponseEntity.ok(updated);
    }

    // 🔹 UPLOAD OR UPDATE IMAGE SEPARATELY
    @PostMapping("/{id}/image")
    public ResponseEntity<?> uploadMenuItemImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            MenuItem item = menuItemRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            // Generate safe unique filename
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Folder on server
            Path uploadPath = Paths.get("uploads/menu");
            Files.createDirectories(uploadPath);

            // Save file on disk
            Files.copy(file.getInputStream(),
                    uploadPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);

            // Save relative URL in DB (for WebConfig)
            item.setImageUrl("/images/menu/" + fileName);
            menuItemRepository.save(item);

            // Return full URL for frontend
            String fullUrl = "http://localhost:8080" + item.getImageUrl();
            return ResponseEntity.ok(fullUrl);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    // 🔹 DELETE MENU ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
