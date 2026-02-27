
// ============================================================
// FILE: controller/FarmCartController.java
// Base URL: /api/farm/cart
// CONSUMER only
// ============================================================
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.FarmCartItemRequest;
import com.thalir.backend.payload.response.FarmCartResponse;
import com.thalir.backend.service.FarmCartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farm/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CONSUMER')")
public class FarmCartController {

    private final FarmCartService cartService;

    @GetMapping
    public FarmCartResponse getCart(@AuthenticationPrincipal UserDetails user) {
        return cartService.getCart(user.getUsername());
    }

    @PostMapping("/items")
    public ResponseEntity<FarmCartResponse> addItem(
            @Valid @RequestBody FarmCartItemRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.addItem(user.getUsername(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<FarmCartResponse> updateItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.updateItem(user.getUsername(), cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<FarmCartResponse> removeItem(
            @PathVariable Long cartItemId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), cartItemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.noContent().build();
    }
}