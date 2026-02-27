package com.thalir.backend.repository;

import com.thalir.backend.model.Fertilizerproduct;
import com.thalir.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FertilizerProductRepository extends JpaRepository<Fertilizerproduct, Long> {

    Page<Fertilizerproduct> findByIsActiveTrue(Pageable pageable);

    Page<Fertilizerproduct> findByIsActiveTrueAndCategoryIgnoreCase(String category, Pageable pageable);

    @Query("SELECT p FROM Fertilizerproduct p WHERE p.isActive = true AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(p.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Fertilizerproduct> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    List<Fertilizerproduct> findBySeller(User seller);

    List<Fertilizerproduct> findBySellerAndIsActive(User seller, Boolean isActive);
}