package com.foodorder.backend.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.backend.dto.CheckoutRequest;
import com.foodorder.backend.model.CartItem;
import com.foodorder.backend.model.FoodOrder;
import com.foodorder.backend.model.OrderItem;
import com.foodorder.backend.model.User;
import com.foodorder.backend.repository.CartItemRepository;
import com.foodorder.backend.repository.FoodOrderRepository;
import com.foodorder.backend.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final FoodOrderRepository foodOrderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public OrderController(FoodOrderRepository foodOrderRepository, CartItemRepository cartItemRepository,
                           UserRepository userRepository) {
        this.foodOrderRepository = foodOrderRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/checkout")
    public FoodOrder checkout(Authentication authentication, @Valid @RequestBody CheckoutRequest request) {
        User user = getCurrentUser(authentication);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        FoodOrder order = new FoodOrder();
        order.setUser(user);
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("PAID");

        double total = 0.0;
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setItemPrice(cartItem.getFoodItem().getPrice());
            order.getItems().add(orderItem);
            total += cartItem.getFoodItem().getPrice() * cartItem.getQuantity();
        }
        order.setTotalAmount(total);

        FoodOrder savedOrder = foodOrderRepository.save(order);
        cartItemRepository.deleteByUserId(user.getId());
        return savedOrder;
    }

    @GetMapping
    public List<FoodOrder> myOrders(Authentication authentication) {
        User user = getCurrentUser(authentication);
        return foodOrderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    private User getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName()).orElseThrow();
    }
}
