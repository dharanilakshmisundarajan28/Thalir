// ============================================================
// FILE: service/FarmOrderService.java
// CONSUMER places orders, views/cancels own orders
// FARMER views received orders, updates status
// ============================================================
package com.thalir.backend.service;

import com.thalir.backend.model.*;
import com.thalir.backend.payload.request.FarmCheckoutRequest;
import com.thalir.backend.payload.request.FarmOrderStatusRequest;
import com.thalir.backend.payload.response.*;
import com.thalir.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmOrderService {

    private final FarmOrderRepository orderRepository;
    private final FarmCartRepository cartRepository;
    private final FarmProductRepository productRepository;
    private final UserRepository userRepository;

    // ── CONSUMER: checkout ───────────────────────────────────

    @Transactional
    public FarmOrderResponse checkout(String consumerUsername, FarmCheckoutRequest request) {
        User consumer = getUser(consumerUsername);
        FarmCart cart = cartRepository.findByConsumer(consumer)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty"));

        if (cart.getItems().isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot checkout with empty cart");

        // All items must be from the same farmer (group by farmer if needed, for
        // simplicity enforce single farmer)
        User farmer = cart.getItems().get(0).getProduct().getFarmer();

        // Validate & deduct stock
        for (FarmCartItem cartItem : cart.getItems()) {
            FarmProduct product = cartItem.getProduct();
            if (!product.getIsActive())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product '" + product.getName() + "' is no longer available");
            if (product.getStockQuantity() < cartItem.getQuantity())
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for '" + product.getName() +
                                "'. Available: " + product.getStockQuantity());
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        FarmOrder order = FarmOrder.builder()
                .consumer(consumer)
                .farmer(farmer)
                .status(FarmOrder.FarmOrderStatus.PENDING)
                .totalAmount(cart.getTotalPrice())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryPhone(request.getDeliveryPhone())
                .notes(request.getNotes())
                .build();

        List<FarmOrderItem> orderItems = cart.getItems().stream().map(cartItem -> FarmOrderItem.builder()
                .order(order)
                .product(cartItem.getProduct())
                .quantity(cartItem.getQuantity())
                .priceAtOrder(cartItem.getPriceAtAddition())
                .build()).collect(Collectors.toList());

        order.getItems().addAll(orderItems);
        FarmOrder saved = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        return toOrderResponse(saved);
    }

    // ── CONSUMER: view & cancel own orders ──────────────────

    public Page<FarmOrderResponse> getMyOrders(String consumerUsername, int page, int size) {
        return orderRepository
                .findByConsumerOrderByOrderedAtDesc(getUser(consumerUsername), PageRequest.of(page, size))
                .map(this::toOrderResponse);
    }

    public FarmOrderResponse getMyOrder(String consumerUsername, Long orderId) {
        FarmOrder order = getOrder(orderId);
        if (!order.getConsumer().getUsername().equals(consumerUsername))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        return toOrderResponse(order);
    }

    @Transactional
    public FarmOrderResponse cancelOrder(String consumerUsername, Long orderId) {
        FarmOrder order = getOrder(orderId);
        if (!order.getConsumer().getUsername().equals(consumerUsername))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        if (order.getStatus() != FarmOrder.FarmOrderStatus.PENDING)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PENDING orders can be cancelled");

        // Restore stock
        order.getItems().forEach(item -> {
            FarmProduct product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        });

        order.setStatus(FarmOrder.FarmOrderStatus.CANCELLED);
        return toOrderResponse(orderRepository.save(order));
    }

    // ── FARMER: view received orders & update status ─────────

    public Page<FarmOrderResponse> getReceivedOrders(String farmerUsername, int page, int size) {
        return orderRepository
                .findByFarmerOrderByOrderedAtDesc(getUser(farmerUsername), PageRequest.of(page, size))
                .map(this::toOrderResponse);
    }

    @Transactional
    public FarmOrderResponse updateOrderStatus(String farmerUsername, Long orderId, FarmOrderStatusRequest request) {
        FarmOrder order = getOrder(orderId);
        if (!order.getFarmer().getUsername().equals(farmerUsername))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order is not for your products");
        if (order.getStatus() == FarmOrder.FarmOrderStatus.DELIVERED ||
                order.getStatus() == FarmOrder.FarmOrderStatus.CANCELLED)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot update a " + order.getStatus() + " order");
        order.setStatus(request.getStatus());
        return toOrderResponse(orderRepository.save(order));
    }

    // ── Helpers ──────────────────────────────────────────────

    private FarmOrder getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private FarmOrderResponse toOrderResponse(FarmOrder order) {
        List<FarmOrderItemResponse> items = order.getItems().stream().map(item -> FarmOrderItemResponse.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unit(item.getProduct().getUnit())
                .quantity(item.getQuantity())
                .priceAtOrder(item.getPriceAtOrder())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        return FarmOrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .consumerName(order.getConsumer().getUsername())
                .farmerName(order.getFarmer().getUsername())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryPhone(order.getDeliveryPhone())
                .notes(order.getNotes())
                .orderedAt(order.getOrderedAt())
                .build();
    }
}