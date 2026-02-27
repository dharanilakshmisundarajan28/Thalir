package com.thalir.backend.service;

import com.thalir.backend.model.*;
import com.thalir.backend.payload.request.CartItemRequest;
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
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FertilizerProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartResponse getCart(String farmerUsername) {
        User farmer = getUser(farmerUsername);
        Cart cart = cartRepository.findByFarmer(farmer)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().farmer(farmer).build()));
        return toCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(String farmerUsername, CartItemRequest request) {
        User farmer = getUser(farmerUsername);
        Cart cart = cartRepository.findByFarmer(farmer)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder().farmer(farmer).build()));

        Fertilizerproduct product = productRepository.findById(request.getProductId())
                .filter(Fertilizerproduct::getIsActive)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found or unavailable"));

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + product.getStockQuantity());
        }

        cartItemRepository.findByCartAndProduct(cart, product).ifPresentOrElse(
                existing -> {
                    int newQty = existing.getQuantity() + request.getQuantity();
                    if (product.getStockQuantity() < newQty) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                "Insufficient stock. Available: " + product.getStockQuantity());
                    }
                    existing.setQuantity(newQty);
                    cartItemRepository.save(existing);
                },
                () -> {
                    CartItem item = CartItem.builder()
                            .cart(cart)
                            .product(product)
                            .quantity(request.getQuantity())
                            .priceAtAddition(product.getPrice())
                            .build();
                    cart.getItems().add(item);
                });

        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(String farmerUsername, Long cartItemId, Integer quantity) {
        CartItem item = getCartItemOwnedBy(farmerUsername, cartItemId);

        if (quantity <= 0) {
            item.getCart().getItems().remove(item);
            cartItemRepository.delete(item);
            return toCartResponse(cartRepository.save(item.getCart()));
        }

        if (item.getProduct().getStockQuantity() < quantity) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Insufficient stock. Available: " + item.getProduct().getStockQuantity());
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return toCartResponse(item.getCart());
    }

    @Transactional
    public CartResponse removeItem(String farmerUsername, Long cartItemId) {
        CartItem item = getCartItemOwnedBy(farmerUsername, cartItemId);
        Cart cart = item.getCart();
        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        return toCartResponse(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(String farmerUsername) {
        User farmer = getUser(farmerUsername);
        cartRepository.findByFarmer(farmer).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }

    private CartItem getCartItemOwnedBy(String farmerUsername, Long cartItemId) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cart item not found"));
        if (!item.getCart().getFarmer().getUsername().equals(farmerUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        return item;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found"));
    }

    public CartResponse toCartResponse(Cart cart) {
        var items = cart.getItems().stream().map(item -> CartItemResponse.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImageUrl(item.getProduct().getImageUrl())
                .unit(item.getProduct().getUnit())
                .quantity(item.getQuantity())
                .priceAtAddition(item.getPriceAtAddition())
                .subtotal(item.getSubtotal())
                .build()).collect(Collectors.toList());

        return CartResponse.builder()
                .cartId(cart.getId())
                .items(items)
                .totalPrice(cart.getTotalPrice())
                .totalItems(items.size())
                .build();
    }
}