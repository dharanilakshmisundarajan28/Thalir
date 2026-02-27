// ============================================================
// FILE: controller/FarmProductController.java
// Base URL: /api/farm/products
// ============================================================
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.FarmProductRequest;
import com.thalir.backend.payload.response.FarmProductResponse;
import com.thalir.backend.service.FarmProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farm/products")
@RequiredArgsConstructor
public class FarmProductController {

    private final FarmProductService productService;

    // ── PUBLIC / CONSUMER: browse ────────────────────────────

    @GetMapping
    public Page<FarmProductResponse> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return productService.getAllActiveProducts(page, size, sortBy);
    }

    @GetMapping("/{id}")
    public FarmProductResponse getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
    public Page<FarmProductResponse> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return productService.searchProducts(keyword, page, size);
    }

    @GetMapping("/category/{category}")
    public Page<FarmProductResponse> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return productService.getByCategory(category, page, size);
    }

    @GetMapping("/farmer/{farmerId}")
    public Page<FarmProductResponse> getByFarmer(
            @PathVariable Long farmerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return productService.getProductsByFarmer(farmerId, page, size);
    }

    // ── FARMER: manage own produce ───────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('FARMER')")
    public List<FarmProductResponse> getMyProducts(@AuthenticationPrincipal UserDetails user) {
        return productService.getMyProducts(user.getUsername());
    }

    @PostMapping
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<FarmProductResponse> createProduct(
            @Valid @RequestBody FarmProductRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.createProduct(request, user.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<FarmProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody FarmProductRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(productService.updateProduct(id, request, user.getUsername()));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Void> deactivateProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        productService.deactivateProduct(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails user) {
        productService.deleteProduct(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }
}
