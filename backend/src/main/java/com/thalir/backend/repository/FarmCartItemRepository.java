
// ============================================================
// FILE: repository/FarmCartItemRepository.java
// ============================================================
package com.thalir.backend.repository;

import com.thalir.backend.model.FarmCart;
import com.thalir.backend.model.FarmCartItem;
import com.thalir.backend.model.FarmProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FarmCartItemRepository extends JpaRepository<FarmCartItem, Long> {
    Optional<FarmCartItem> findByCartAndProduct(FarmCart cart, FarmProduct product);
}
