
// ============================================================
// FILE: repository/FarmCartRepository.java
// ============================================================
package com.thalir.backend.repository;

import com.thalir.backend.model.FarmCart;
import com.thalir.backend.model.FarmCartItem;
import com.thalir.backend.model.FarmProduct;
import com.thalir.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmCartRepository extends JpaRepository<FarmCart, Long> {
    Optional<FarmCart> findByConsumer(User consumer);
}