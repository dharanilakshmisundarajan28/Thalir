
// ============================================================
// FILE: service/FarmCartService.java
// CONSUMER manages their farm produce cart
// ============================================================
package com.thalir.backend.service;

import com.thalir.backend.model.*;
import com.thalir.backend.payload.request.FarmCartItemRequest;
import com.thalir.backend.payload.response.*;
import com.thalir.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmCartService {

    private final FarmCartRepository cartRepository;
    private final FarmCartItemRepository cartItemRepository;
    private final FarmProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public FarmCartResponse getCart(String consumerUsername) {
        User consumer = getUser(consumerUsername);
        FarmCart cart = cartRepository.findByConsumer(consumer)
                .orElseGet(() -> cartRepository.save(
                        FarmCart.builder().consumer(consumer).build()));
        return toCartResponse(cart);
    }

    @Transactional
    public FarmCartResponse addItem(String consumerUsername, FarmCartItemRequest request) {
        User consumer = getUser(consumerUsername);
        FarmCart cart = cartRepository.findByConsumer(consumer)
                .orElseGet(() -> cartRepository.save(
                        FarmCart.builder().consumer(consumer).build()));

        FarmProduct product = productRepository.findById(request.getProductId())
                .filter(FarmProduct::getIsActive)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found or unavailable"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + product.getStockQuantity());
        }

        cartItemRepository.findByCartAndProduct(cart, product).ifPresentOrElse(
                existing -> {
                    int newQty = existing.getQuantity() + request.getQuantity();
                    if (product.getStockQuantity() < newQty)
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Insufficient stock. Available: " + product.getStockQuantity());
                    existing.setQuantity(newQty);
                    cartItemRepository.save(existing);
                },
                () -> {
                    FarmCartItem item = FarmCartItem.builder()
                            .cart(cart).product(product)
                            .quantity(request.getQuantity())
                            .priceAtAddition(product.getPrice())
                            .build();
                    cart.getItems().add(item);
                });

        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public FarmCartResponse updateItem(String consumerUsername, Long cartItemId, Integer quantity) {
        FarmCartItem item = getCartItemOwnedBy(consumerUsername, cartItemId);
        if (quantity <= 0) {
            item.getCart().getItems().remove(item);
            cartItemRepository.delete(item);
            return toCartResponse(cartRepository.save(item.getCart()));
        }
        if (item.getProduct().getStockQuantity() < quantity)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + item.getProduct().getStockQuantity());
        item.setQuantity(quantity);
        return toCartResponse(cartRepository.save(item.getCart()));
    }

    @Transactional
    public FarmCartResponse removeItem(String consumerUsername, Long cartItemId) {
        FarmCartItem item = getCartItemOwnedBy(consumerUsername, cartItemId);
        FarmCart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String consumerUsername) {
        cartRepository.findByConsumer(getUser(consumerUsername)).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private FarmCartItem getCartItemOwnedBy(String username, Long cartItemId) {
        FarmCartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!item.getCart().getConsumer().getUsername().equals(username))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        return item;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public FarmCartResponse toCartResponse(FarmCart cart) {
        var items = cart.getItems().stream().map(item -> FarmCartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .farmerName(item.getProduct().getFarmer().getUsername())
                .unit(item.getProduct().getUnit())
                .quantity(item.getQuantity())
                .priceAtAddition(item.getPriceAtAddition())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        return FarmCartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalPrice(cart.getTotalPrice())
                .totalItems(items.size())
                .build();
    }
}