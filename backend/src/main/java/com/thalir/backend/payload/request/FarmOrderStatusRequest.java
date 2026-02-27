
// FILE: payload/request/FarmOrderStatusRequest.java
package com.thalir.backend.payload.request;

import com.thalir.backend.model.FarmOrder;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FarmOrderStatusRequest {
    @NotNull
    private FarmOrder.FarmOrderStatus status;
}