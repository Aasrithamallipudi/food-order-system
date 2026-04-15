package com.foodorder.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.backend.model.FoodItem;
import com.foodorder.backend.model.Restaurant;
import com.foodorder.backend.repository.FoodItemRepository;
import com.foodorder.backend.repository.RestaurantRepository;
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;

    public RestaurantController(RestaurantRepository restaurantRepository, FoodItemRepository foodItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @GetMapping
    public List<Restaurant> allRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/{restaurantId}/foods")
    public List<FoodItem> restaurantFoods(@PathVariable Long restaurantId) {
        return foodItemRepository.findByRestaurantId(restaurantId);
    }
}
