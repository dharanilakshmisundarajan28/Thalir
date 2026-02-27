
// FILE: payload/request/FarmCheckoutRequest.java
package com.thalir.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmCheckoutRequest {
    @NotBlank
    private String deliveryAddress;
    private String deliveryPhone;
    private String notes;
}
