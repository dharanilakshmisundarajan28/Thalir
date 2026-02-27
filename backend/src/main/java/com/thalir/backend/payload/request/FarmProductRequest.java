// ============================================================
// REQUESTS  — save in payload/request/
// ============================================================

// FILE: payload/request/FarmProductRequest.java
package com.thalir.backend.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FarmProductRequest {
    @NotBlank(message = "Product name is required")
    private String name;
    private String description;
    @NotBlank(message = "Category is required")
    private String category;
    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;
    @NotNull
    @Min(0)
    private Integer stockQuantity;
    private String unit;
    private String imageUrl;
}