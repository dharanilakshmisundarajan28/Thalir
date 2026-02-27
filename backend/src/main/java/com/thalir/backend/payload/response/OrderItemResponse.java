// FILE: payload/response/OrderItemResponse.java
package com.thalir.backend.payload.response;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String unit;
    private Integer quantity;
    private BigDecimal priceAtOrder;
    private BigDecimal subtotal;
}
