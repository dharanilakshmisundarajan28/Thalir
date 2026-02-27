// ============================================================
// FILE: service/FarmProductService.java
// FARMER manages their own produce listings
// CONSUMER browses all farmer products
// ============================================================
package com.thalir.backend.service;

import com.thalir.backend.model.FarmProduct;
import com.thalir.backend.model.User;
import com.thalir.backend.payload.request.FarmProductRequest;
import com.thalir.backend.payload.response.FarmProductResponse;
import com.thalir.backend.repository.FarmProductRepository;
import com.thalir.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FarmProductService {

    private final FarmProductRepository productRepository;
    private final UserRepository userRepository;

    // ── FARMER: manage own products ──────────────────────────

    @Transactional
    public FarmProductResponse createProduct(FarmProductRequest req, String farmerUsername) {
        User farmer = getUser(farmerUsername);
        return toResponse(productRepository.save(FarmProduct.builder()
                .name(req.getName())
                .description(req.getDescription())
                .category(req.getCategory())
                .price(req.getPrice())
                .stockQuantity(req.getStockQuantity())
                .unit(req.getUnit())
                .imageUrl(req.getImageUrl())
                .isActive(true)
                .farmer(farmer)
                .build()));
    }

    @Transactional
    public FarmProductResponse updateProduct(Long productId, FarmProductRequest req, String farmerUsername) {
        FarmProduct product = getProductOwnedBy(productId, farmerUsername);
        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setCategory(req.getCategory());
        product.setPrice(req.getPrice());
        product.setStockQuantity(req.getStockQuantity());
        product.setUnit(req.getUnit());
        product.setImageUrl(req.getImageUrl());
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deactivateProduct(Long productId, String farmerUsername) {
        FarmProduct product = getProductOwnedBy(productId, farmerUsername);
        product.setIsActive(false);
        productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId, String farmerUsername) {
        productRepository.delete(getProductOwnedBy(productId, farmerUsername));
    }

    @Transactional(readOnly = true)
    public List<FarmProductResponse> getMyProducts(String farmerUsername) {
        return productRepository.findByFarmer(getUser(farmerUsername))
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── CONSUMER: browse products ────────────────────────────

    @Transactional(readOnly = true)
    public Page<FarmProductResponse> getAllActiveProducts(int page, int size, String sortBy) {
        return productRepository
                .findByIsActiveTrue(PageRequest.of(page, size, Sort.by(sortBy).ascending()))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<FarmProductResponse> getByCategory(String category, int page, int size) {
        return productRepository
                .findByIsActiveTrueAndCategoryIgnoreCase(category, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<FarmProductResponse> searchProducts(String keyword, int page, int size) {
        return productRepository
                .searchByKeyword(keyword, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<FarmProductResponse> getProductsByFarmer(Long farmerId, int page, int size) {
        User farmer = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Farmer not found"));
        return productRepository
                .findByFarmerAndIsActiveTrue(farmer, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public FarmProductResponse getProductById(Long id) {
        return toResponse(productRepository.findById(id)
                .filter(FarmProduct::getIsActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")));
    }

    // ── Helpers ──────────────────────────────────────────────

    private FarmProduct getProductOwnedBy(Long productId, String username) {
        FarmProduct product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!product.getFarmer().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this product");
        }
        return product;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public FarmProductResponse toResponse(FarmProduct p) {
        return FarmProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .category(p.getCategory())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .unit(p.getUnit())
                .imageUrl(p.getImageUrl())
                .isActive(p.getIsActive())
                .farmerId(p.getFarmer().getId())
                .farmerName(p.getFarmer().getUsername())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
