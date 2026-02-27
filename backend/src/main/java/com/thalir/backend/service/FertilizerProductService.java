package com.thalir.backend.service;

import com.thalir.backend.model.Fertilizerproduct;
import com.thalir.backend.model.User;
import com.thalir.backend.payload.request.ProductRequest;
import com.thalir.backend.payload.response.ProductResponse;
import com.thalir.backend.repository.FertilizerProductRepository;
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
public class FertilizerProductService {

    private final FertilizerProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest request, String sellerUsername) {
        User seller = getUserByUsername(sellerUsername);
        Fertilizerproduct product = Fertilizerproduct.builder()
                .name(request.getName())
                .description(request.getDescription())
                .brand(request.getBrand())
                .category(request.getCategory())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .unit(request.getUnit())
                .imageUrl(request.getImageUrl())
                .isActive(true)
                .seller(seller)
                .build();
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request, String sellerUsername) {
        Fertilizerproduct product = getProductOwnedBy(productId, sellerUsername);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrand(request.getBrand());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setImageUrl(request.getImageUrl());
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deactivateProduct(Long productId, String sellerUsername) {
        Fertilizerproduct product = getProductOwnedBy(productId, sellerUsername);
        product.setIsActive(false);
        productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long productId, String sellerUsername) {
        Fertilizerproduct product = getProductOwnedBy(productId, sellerUsername);
        productRepository.delete(product);
    }

    public List<ProductResponse> getMyProducts(String sellerUsername) {
        User seller = getUserByUsername(sellerUsername);
        return productRepository.findBySeller(seller)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Page<ProductResponse> getAllActiveProducts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return productRepository.findByIsActiveTrue(pageable).map(this::toResponse);
    }

    public Page<ProductResponse> getByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return productRepository
                .findByIsActiveTrueAndCategoryIgnoreCase(category, pageable)
                .map(this::toResponse);
    }

    public Page<ProductResponse> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchByKeyword(keyword, pageable).map(this::toResponse);
    }

    public ProductResponse getProductById(Long productId) {
        return toResponse(productRepository.findById(productId)
                .filter(Fertilizerproduct::getIsActive)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found")));
    }

    private Fertilizerproduct getProductOwnedBy(Long productId, String sellerUsername) {
        Fertilizerproduct product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!product.getSeller().getUsername().equals(sellerUsername)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this product");
        }
        return product;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public ProductResponse toResponse(Fertilizerproduct p) {
        return ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .brand(p.getBrand())
                .category(p.getCategory())
                .price(p.getPrice())
                .stockQuantity(p.getStockQuantity())
                .unit(p.getUnit())
                .imageUrl(p.getImageUrl())
                .isActive(p.getIsActive())
                .sellerId(p.getSeller().getId())
                .sellerName(p.getSeller().getUsername())
                .createdAt(p.getCreatedAt())
                .build();
    }
}