package com.foodorder.backend.repository;

import com.foodorder.backend.model.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    List<FoodOrder> findByUserIdOrderByCreatedAtDesc(Long userId);
}
