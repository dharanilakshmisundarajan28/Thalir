package com.thalir.backend.repository;

import com.thalir.backend.model.Cart;
import com.thalir.backend.model.CartItem;
import com.thalir.backend.model.Fertilizerproduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct(Cart cart, Fertilizerproduct product);
}