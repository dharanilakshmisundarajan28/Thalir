package com.thalir.backend.service;

import com.thalir.backend.model.*;
import com.thalir.backend.payload.request.CheckoutRequest;
import com.thalir.backend.payload.request.OrderStatusRequest;
import com.thalir.backend.payload.response.OrderItemResponse;
import com.thalir.backend.payload.response.OrderResponse;
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
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final FertilizerProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse checkout(String farmerUsername, CheckoutRequest request) {
        User farmer = getUser(farmerUsername);

        Cart cart = cartRepository.findByFarmer(farmer)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Cannot checkout with an empty cart");
        }

        // Validate stock and deduct
        for (CartItem cartItem : cart.getItems()) {
            Fertilizerproduct product = cartItem.getProduct();
            if (!product.getIsActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Product '" + product.getName() + "' is no longer available");
            }
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Insufficient stock for '" + product.getName() +
                                "'. Available: " + product.getStockQuantity());
            }
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order order = Order.builder()
                .farmer(farmer)
                .status(Order.OrderStatus.PENDING)
                .totalAmount(cart.getTotalPrice())
                .deliveryAddress(request.getDeliveryAddress())
                .deliveryPhone(request.getDeliveryPhone())
                .notes(request.getNotes())
                .build();

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> OrderItem.builder()
                .order(order)
                .product(cartItem.getProduct())
                .quantity(cartItem.getQuantity())
                .priceAtOrder(cartItem.getPriceAtAddition())
                .build()).collect(Collectors.toList());

        order.getItems().addAll(orderItems);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after checkout
        cart.getItems().clear();
        cartRepository.save(cart);

        return toOrderResponse(savedOrder);
    }

    public Page<OrderResponse> getMyOrders(String farmerUsername, int page, int size) {
        User farmer = getUser(farmerUsername);
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findByFarmerOrderByOrderedAtDesc(farmer, pageable)
                .map(this::toOrderResponse);
    }

    public OrderResponse getOrderById(Long orderId, String farmerUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));
        if (!order.getFarmer().getUsername().equals(farmerUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, String farmerUsername) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));

        if (!order.getFarmer().getUsername().equals(farmerUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        if (order.getStatus() != Order.OrderStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Only PENDING orders can be cancelled");
        }

        // Restore stock
        order.getItems().forEach(item -> {
            Fertilizerproduct product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        });

        order.setStatus(Order.OrderStatus.CANCELLED);
        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() == Order.OrderStatus.DELIVERED ||
                order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Cannot update a " + order.getStatus() + " order");
        }

        order.setStatus(request.getStatus());
        return toOrderResponse(orderRepository.save(order));
    }

    public Page<OrderResponse> getAllOrders(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderedAt").descending());
        return orderRepository.findAll(pageable).map(this::toOrderResponse);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream().map(item -> OrderItemResponse.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .unit(item.getProduct().getUnit())
                .quantity(item.getQuantity())
                .priceAtOrder(item.getPriceAtOrder())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        return OrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .deliveryAddress(order.getDeliveryAddress())
                .deliveryPhone(order.getDeliveryPhone())
                .notes(order.getNotes())
                .orderedAt(order.getOrderedAt())
                .build();
    }
}