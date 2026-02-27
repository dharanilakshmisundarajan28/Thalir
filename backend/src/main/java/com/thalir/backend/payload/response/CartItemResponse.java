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
public class CartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String unit;
    private Integer quantity;
    private BigDecimal priceAtAddition;
    private BigDecimal subtotal;
}
