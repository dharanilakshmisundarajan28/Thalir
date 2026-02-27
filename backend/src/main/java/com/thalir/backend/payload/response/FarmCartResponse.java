
// FILE: payload/response/FarmCartResponse.java
package com.thalir.backend.payload.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmCartResponse {
    private Long cartId;
    private List<FarmCartItemResponse> items;
    private BigDecimal totalPrice;
    private Integer totalItems;
}