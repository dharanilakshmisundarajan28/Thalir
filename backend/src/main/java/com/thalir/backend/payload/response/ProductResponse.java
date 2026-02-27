package com.thalir.backend.payload.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String brand;
    private String category;
    private BigDecimal price;
    private Integer stockQuantity;
    private String unit;
    private String imageUrl;
    private Boolean isActive;
    private String sellerName;
    private Long sellerId;
    private LocalDateTime createdAt;
}
