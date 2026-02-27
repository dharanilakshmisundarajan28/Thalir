
// ═══════════════════════════════════════════════════════════════════════════
// OrderController.java
// ═══════════════════════════════════════════════════════════════════════════
package com.thalir.backend.controller;

import com.thalir.backend.payload.request.CheckoutRequest;
import com.thalir.backend.payload.request.OrderStatusRequest;
import com.thalir.backend.payload.response.OrderResponse;
import com.thalir.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/fertilizer/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ── FARMER ───────────────────────────────────────────────────────────────

    @PostMapping("/checkout")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<OrderResponse> checkout(
            @Valid @RequestBody CheckoutRequest request,
            Principal principal) {
        OrderResponse order = orderService.checkout(principal.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Page<OrderResponse>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        return ResponseEntity.ok(orderService.getMyOrders(principal.getName(), page, size));
    }

    @GetMapping("/my/{orderId}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<OrderResponse> getMyOrder(
            @PathVariable Long orderId,
            Principal principal) {
        return ResponseEntity.ok(orderService.getOrderById(orderId, principal.getName()));
    }

    @PatchMapping("/my/{orderId}/cancel")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long orderId,
            Principal principal) {
        return ResponseEntity.ok(orderService.cancelOrder(orderId, principal.getName()));
    }

    // ── ADMIN ────────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROVIDER')")
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAllOrders(page, size));
    }

    @PatchMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('PROVIDER')")
    public ResponseEntity<OrderResponse> updateStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request));
    }
}