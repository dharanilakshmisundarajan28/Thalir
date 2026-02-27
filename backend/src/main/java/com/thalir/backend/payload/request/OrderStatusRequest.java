
// FILE: payload/request/OrderStatusRequest.java
package com.thalir.backend.payload.request;

import com.thalir.backend.model.Order;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderStatusRequest {

    @NotNull(message = "Status is required")
    private Order.OrderStatus status;
}