
// ============================================================
// FILE: controller/FarmOrderController.java
// Base URL: /api/farm/orders
// CONSUMER: checkout, my orders, cancel
// FARMER:   received orders, update status
// ============================================================
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.FarmCheckoutRequest;
import com.thalir.backend.payload.request.FarmOrderStatusRequest;
import com.thalir.backend.payload.response.FarmOrderResponse;
import com.thalir.backend.service.FarmOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/farm/orders")
@RequiredArgsConstructor
public class FarmOrderController {

    private final FarmOrderService orderService;

    // ── CONSUMER endpoints ───────────────────────────────────

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<FarmOrderResponse> checkout(
            @Valid @RequestBody FarmCheckoutRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.checkout(user.getUsername(), request));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('CONSUMER')")
    public Page<FarmOrderResponse> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails user) {
        return orderService.getMyOrders(user.getUsername(), page, size);
    }

    @GetMapping("/my/{orderId}")
    @PreAuthorize("hasRole('CONSUMER')")
    public FarmOrderResponse getMyOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user) {
        return orderService.getMyOrder(user.getUsername(), orderId);
    }

    @PatchMapping("/my/{orderId}/cancel")
    @PreAuthorize("hasRole('CONSUMER')")
    public ResponseEntity<FarmOrderResponse> cancelOrder(
            @PathVariable Long orderId,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.cancelOrder(user.getUsername(), orderId));
    }

    // ── FARMER endpoints ─────────────────────────────────────

    @GetMapping("/received")
    @PreAuthorize("hasRole('FARMER')")
    public Page<FarmOrderResponse> getReceivedOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails user) {
        return orderService.getReceivedOrders(user.getUsername(), page, size);
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<FarmOrderResponse> updateStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody FarmOrderStatusRequest request,
            @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.updateOrderStatus(user.getUsername(), orderId, request));
    }
}