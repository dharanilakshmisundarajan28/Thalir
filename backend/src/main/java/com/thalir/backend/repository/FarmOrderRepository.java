// ============================================================
// FILE: repository/FarmOrderRepository.java
// ============================================================
package com.thalir.backend.repository;

import com.thalir.backend.model.FarmOrder;
import com.thalir.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FarmOrderRepository extends JpaRepository<FarmOrder, Long> {

    // Consumer: my orders
    Page<FarmOrder> findByConsumerOrderByOrderedAtDesc(User consumer, Pageable pageable);

    // Farmer: orders received for their products
    Page<FarmOrder> findByFarmerOrderByOrderedAtDesc(User farmer, Pageable pageable);
}