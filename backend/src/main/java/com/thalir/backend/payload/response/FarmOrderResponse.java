
// FILE: payload/response/FarmOrderResponse.java
package com.thalir.backend.payload.response;

import com.thalir.backend.model.FarmOrder;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FarmOrderResponse {
    private Long orderId;
    private FarmOrder.FarmOrderStatus status;
    private List<FarmOrderItemResponse> items;
    private BigDecimal totalAmount;
    private String consumerName;
    private String farmerName;
    private String deliveryAddress;
    private String deliveryPhone;
    private String notes;
    private LocalDateTime orderedAt;
}