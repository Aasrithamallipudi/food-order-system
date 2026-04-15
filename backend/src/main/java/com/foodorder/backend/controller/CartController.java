package com.foodorder.backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.backend.model.CartItem;
import com.foodorder.backend.model.FoodItem;
import com.foodorder.backend.model.User;
import com.foodorder.backend.repository.CartItemRepository;
import com.foodorder.backend.repository.FoodItemRepository;
import com.foodorder.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    public CartController(CartItemRepository cartItemRepository, FoodItemRepository foodItemRepository,
                          UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.foodItemRepository = foodItemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<CartItem> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return cartItemRepository.findByUserId(user.getId());
    }

    @PostMapping("/add")
    public CartItem addToCart(Authentication authentication, @RequestParam Long foodId, @RequestParam(defaultValue = "1") Integer qty) {
        try {
            System.out.println("Add to cart request - Food ID: " + foodId + ", Quantity: " + qty);
            System.out.println("Authentication: " + authentication);
            System.out.println("Authentication name: " + (authentication != null ? authentication.getName() : "null"));
            
            User user = getCurrentUser(authentication);
            System.out.println("User found: " + user.getEmail());
            
            FoodItem foodItem = foodItemRepository.findById(foodId).orElseThrow(() -> {
                System.out.println("Food item not found with ID: " + foodId);
                return new RuntimeException("Food item not found");
            });
            
            System.out.println("Food item found: " + foodItem.getName());

            CartItem item = new CartItem();
            item.setUser(user);
            item.setFoodItem(foodItem);
            item.setQuantity(qty);
            
            CartItem savedItem = cartItemRepository.save(item);
            System.out.println("Cart item saved successfully: " + savedItem.getId());
            
            return savedItem;
        } catch (Exception e) {
            System.out.println("Error in addToCart: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void removeCartItem(@PathVariable Long id) {
        cartItemRepository.deleteById(id);
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            System.out.println("Authentication is null");
            throw new RuntimeException("User not authenticated");
        }
        
        String email = authentication.getName();
        System.out.println("Looking for user with email: " + email);
        
        return userRepository.findByEmail(email).orElseThrow(() -> {
            System.out.println("User not found with email: " + email);
            return new RuntimeException("User not found");
        });
    }
}
