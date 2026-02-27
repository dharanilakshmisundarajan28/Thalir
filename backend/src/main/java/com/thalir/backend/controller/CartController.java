
// ═══════════════════════════════════════════════════════════════════════════
// CartController.java
// ═══════════════════════════════════════════════════════════════════════════
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.CartItemRequest;
import com.thalir.backend.payload.response.CartResponse;
import com.thalir.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/fertilizer/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('FARMER')")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Principal principal) {
        return ResponseEntity.ok(cartService.getCart(principal.getName()));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(
            @Valid @RequestBody CartItemRequest request,
            Principal principal) {
        return ResponseEntity.ok(cartService.addItem(principal.getName(), request));
    }

    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable Long cartItemId,
            @RequestParam Integer quantity,
            Principal principal) {
        return ResponseEntity.ok(cartService.updateItem(principal.getName(), cartItemId, quantity));
    }

    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<CartResponse> removeItem(
            @PathVariable Long cartItemId,
            Principal principal) {
        return ResponseEntity.ok(cartService.removeItem(principal.getName(), cartItemId));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Principal principal) {
        cartService.clearCart(principal.getName());
        return ResponseEntity.noContent().build();
    }
}
