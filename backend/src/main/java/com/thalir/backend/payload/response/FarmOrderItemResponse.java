
// FILE: payload/response/FarmOrderItemResponse.java
package com.thalir.backend.payload.response;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmOrderItemResponse {
    private Long productId;
    private String productName;
    private String unit;
    private Integer quantity;
    private BigDecimal priceAtOrder;
    private BigDecimal subtotal;
}