// FILE: payload/request/CartItemRequest.java
package com.thalir.backend.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
}
