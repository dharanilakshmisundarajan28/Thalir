
// FILE: payload/response/FarmCartItemResponse.java
package com.thalir.backend.payload.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmCartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String farmerName;
    private String unit;
    private Integer quantity;
    private BigDecimal priceAtAddition;
    private BigDecimal subtotal;
}