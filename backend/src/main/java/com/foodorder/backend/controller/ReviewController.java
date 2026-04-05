package com.foodorder.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodorder.backend.model.Restaurant;
import com.foodorder.backend.model.Review;
import com.foodorder.backend.model.User;
import com.foodorder.backend.repository.RestaurantRepository;
import com.foodorder.backend.repository.ReviewRepository;
import com.foodorder.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, RestaurantRepository restaurantRepository,
                            UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.restaurantRepository = restaurantRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{restaurantId}")
    public List<Review> list(@PathVariable Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId);
    }

    @PostMapping("/{restaurantId}")
    public Review addReview(Authentication authentication, @PathVariable Long restaurantId, @RequestBody Map<String, String> payload) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElseThrow();

        String ratingValue = payload.getOrDefault("rating", "5").trim();
        int rating;
        try {
            rating = Integer.parseInt(ratingValue);
        } catch (NumberFormatException ex) {
            rating = 5;
        }
        if (rating < 1) rating = 1;
        if (rating > 5) rating = 5;

        Review review = new Review();
        review.setUser(user);
        review.setRestaurant(restaurant);
        review.setRating(rating);
        review.setComment(payload.getOrDefault("comment", "").trim());
        return reviewRepository.save(review);
    }
}
