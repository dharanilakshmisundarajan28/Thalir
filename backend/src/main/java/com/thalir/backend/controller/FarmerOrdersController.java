package com.thalir.backend.controller;

import com.thalir.backend.payload.response.FarmOrderResponse;
import com.thalir.backend.service.FarmOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import java.security.Principal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/farmer/orders")
@RequiredArgsConstructor
public class FarmerOrdersController {

    private final FarmOrderService orderService;

    /**
     * Alias for the farmer "received orders" endpoint.
     * Returns orders placed by consumers to the requesting farmer.
     */
    @GetMapping
    @PreAuthorize("hasRole('FARMER')")
    public Page<FarmOrderResponse> getCustomerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        return orderService.getReceivedOrders(principal.getName(), page, size);
    }
}
