
// ============================================================
// FILE 2: model/FarmCart.java
// ============================================================
package com.thalir.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "farm_carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmCart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "consumer_id", nullable = false, unique = true)
    private User consumer;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FarmCartItem> items = new ArrayList<>();

    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public BigDecimal getTotalPrice() {
        return items.stream().map(FarmCartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}