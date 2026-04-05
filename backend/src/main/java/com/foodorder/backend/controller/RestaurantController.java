package com.foodorder.backend.controller;

import com.foodorder.backend.model.FoodItem;
import com.foodorder.backend.model.Restaurant;
import com.foodorder.backend.repository.FoodItemRepository;
import com.foodorder.backend.repository.RestaurantRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
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
