
package com.thalir.backend.repository;

import com.thalir.backend.model.Order;
import com.thalir.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByFarmerOrderByOrderedAtDesc(User farmer, Pageable pageable);

    List<Order> findByStatus(Order.OrderStatus status);
}