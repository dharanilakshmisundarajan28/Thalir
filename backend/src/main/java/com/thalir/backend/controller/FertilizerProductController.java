// ═══════════════════════════════════════════════════════════════════════════
// FertilizerProductController.java
// ═══════════════════════════════════════════════════════════════════════════
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.ProductRequest;
import com.thalir.backend.payload.response.ProductResponse;
import com.thalir.backend.service.FertilizerProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/fertilizer/products")
@RequiredArgsConstructor
public class FertilizerProductController {

    private final FertilizerProductService productService;

    // ── PUBLIC: Browse products (farmers / all) ──────────────────────────────

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy) {
        return ResponseEntity.ok(productService.getAllActiveProducts(page, size, sortBy));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> search(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.searchProducts(keyword, page, size));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<Page<ProductResponse>> getByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.getByCategory(category, page, size));
    }

    // ── PROVIDER: Manage own products ────────────────────────────────────────

    @GetMapping("/my")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<List<ProductResponse>> getMyProducts(Principal principal) {
        return ResponseEntity.ok(productService.getMyProducts(principal.getName()));
    }

    @PostMapping
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            Principal principal) {
        ProductResponse response = productService.createProduct(request, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request,
            Principal principal) {
        return ResponseEntity.ok(productService.updateProduct(id, request, principal.getName()));
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('PROVIDER')")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Long id, Principal principal) {
        productService.deactivateProduct(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROVIDER') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id, Principal principal) {
        productService.deleteProduct(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
