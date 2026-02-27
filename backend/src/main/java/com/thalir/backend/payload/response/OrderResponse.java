package com.thalir.backend.payload.response;

import com.thalir.backend.model.Order;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private Order.OrderStatus status;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private String deliveryPhone;
    private String notes;
    private LocalDateTime orderedAt;
}
