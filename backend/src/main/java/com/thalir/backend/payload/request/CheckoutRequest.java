// FILE: payload/request/CheckoutRequest.java
package com.thalir.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequest {

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String deliveryPhone;

    private String notes;
}
