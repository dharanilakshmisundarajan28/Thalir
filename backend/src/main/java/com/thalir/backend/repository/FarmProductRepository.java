// ============================================================
// FILE: repository/FarmProductRepository.java
// ============================================================
package com.thalir.backend.repository;

import com.thalir.backend.model.FarmProduct;
import com.thalir.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FarmProductRepository extends JpaRepository<FarmProduct, Long> {

    // Consumer: browse all active products from all farmers
    Page<FarmProduct> findByIsActiveTrue(Pageable pageable);

    // Consumer: filter by category
    Page<FarmProduct> findByIsActiveTrueAndCategoryIgnoreCase(String category, Pageable pageable);

    // Consumer: search
    @Query("SELECT p FROM FarmProduct p WHERE p.isActive = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
            " LOWER(p.category) LIKE LOWER(CONCAT('%',:kw,'%')) OR " +
            " LOWER(p.description) LIKE LOWER(CONCAT('%',:kw,'%')))")
    Page<FarmProduct> searchByKeyword(@Param("kw") String keyword, Pageable pageable);

    // Consumer: products by a specific farmer
    Page<FarmProduct> findByFarmerAndIsActiveTrue(User farmer, Pageable pageable);

    // Farmer: manage own products
    List<FarmProduct> findByFarmer(User farmer);
}
