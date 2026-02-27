// FILE: payload/request/FarmCartItemRequest.java
package com.thalir.backend.payload.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class FarmCartItemRequest {
    @NotNull
    private Long productId;
    @NotNull
    @Min(1)
    private Integer quantity;
}