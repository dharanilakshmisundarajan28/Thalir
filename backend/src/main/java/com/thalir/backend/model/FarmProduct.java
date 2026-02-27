// ============================================================
// COMPLETE WORKFLOW OVERVIEW
// ============================================================
//
// PROVIDER (Fertilizer company)
//   -> manages fertilizer products  (/api/fertilizer/products)
//   -> views orders FROM farmers    (/api/fertilizer/orders)
//   -> updates order status         (/api/fertilizer/orders/{id}/status)
//
// FARMER
//   -> buys fertilizer from provider:
//        browse products, add to cart, checkout, view/cancel own orders
//        (/api/fertilizer/cart, /api/fertilizer/orders/my/**)
//   -> sells farm produce to consumers:
//        manage own farm products   (/api/farm/products/my)
//        view orders received       (/api/farm/orders/received)
//        update order status        (/api/farm/orders/{id}/status)
//
// CONSUMER (Buyer)
//   -> buys farm produce from farmers:
//        browse all farmer products (/api/farm/products)
//        add to cart, checkout      (/api/farm/cart)
//        view/cancel own orders     (/api/farm/orders/my/**)
//
// ============================================================

// ============================================================
// FILE 1: model/FarmProduct.java
// ============================================================
package com.thalir.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "farm_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    private String category; // e.g. VEGETABLE, FRUIT, GRAIN, DAIRY

    @NotNull
    @DecimalMin("0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    private String unit; // kg, dozen, litre, etc.
    private String imageUrl;

    @Column(nullable = false)
    private Boolean isActive = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
