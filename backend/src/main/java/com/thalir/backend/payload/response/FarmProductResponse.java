
// ============================================================
// RESPONSES  — save in payload/response/
// ============================================================

// FILE: payload/response/FarmProductResponse.java
package com.thalir.backend.payload.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmProductResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    private Integer stockQuantity;
    private String unit;
    private String imageUrl;
    private Boolean isActive;
    private Long farmerId;
    private String farmerName;
    private LocalDateTime createdAt;
}
