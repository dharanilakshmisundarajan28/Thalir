package com.thalir.backend.repository;

import com.thalir.backend.model.Cart;
import com.thalir.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByFarmer(User farmer);
}
