import { useEffect, useState } from "react";
import api from "../api";
import Header from "../components/Header";
import RestaurantCard from "../components/RestaurantCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import RestaurantMenuView from "../components/RestaurantMenuView";

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [foodsByRestaurant, setFoodsByRestaurant] = useState({});
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setShowWelcome(true);
      const welcomeTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(welcomeTimer);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
    loadCartCount();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      console.log("Loading restaurants from backend...");
      
      // Check if user is authenticated first
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, loading fallback restaurants");
        loadFallbackRestaurants();
        return;
      }
      
      const res = await api.get("/restaurants");
      console.log("Backend response:", res.data);
      console.log("Number of restaurants:", res.data.length);
      
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
      
      // Load foods for each restaurant
      for (const r of res.data) {
        try {
          const foodsRes = await api.get(`/restaurants/${r.id}/foods`);
          setFoodsByRestaurant((prev) => ({ ...prev, [r.id]: foodsRes.data }));
        } catch (foodErr) {
          console.error(`Error loading foods for restaurant ${r.id}:`, foodErr);
        }
      }
      
      console.log("Successfully loaded all restaurants and foods");
    } catch (err) {
      console.error("Error loading restaurants:", err);
      console.error("Error details:", err.response?.data);
      
      // If unauthorized, clear token and use fallback
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      }
      
      loadFallbackRestaurants();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackRestaurants = () => {
    const fallbackRestaurants = [
      { 
        id: 1, 
        name: "🍛 Spice Garden", 
        cuisine: "North Indian", 
        rating: 4.6, 
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80",
        active: true
      },
      { 
        id: 2, 
        name: "🍕 Urban Pizza House", 
        cuisine: "Italian", 
        rating: 4.5, 
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        active: true
      },
      { 
        id: 3, 
        name: "🥢 Dragon Palace", 
        cuisine: "Chinese", 
        rating: 4.4, 
        imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
        active: true
      },
      { 
        id: 4, 
        name: "🍝 Bella Italia", 
        cuisine: "Italian", 
        rating: 4.7, 
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        active: true
      },
      { 
        id: 5, 
        name: "🍔 Burger Point", 
        cuisine: "Fast Food", 
        rating: 4.3, 
        imageUrl: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop&q=80",
        active: true
      },
      { 
        id: 6, 
        name: "☕ Coffee House", 
        cuisine: "Cafe & Desserts", 
        rating: 4.8, 
        imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&auto=format&fit=crop&q=80",
        active: true
      }
    ];
    
    console.log("Using fallback restaurants:", fallbackRestaurants);
    setRestaurants(fallbackRestaurants);
    setFilteredRestaurants(fallbackRestaurants);
  };

  const loadCartCount = async () => {
    try {
      const res = await api.get("/cart");
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error("Error loading cart count:", err);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;
    
    if (selectedCuisine !== "all") {
      filtered = filtered.filter(restaurant => 
        restaurant.cuisine === selectedCuisine
      );
    }
    
    if (searchTerm) {
      filtered = filtered.filter(restaurant => 
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const exactMatch = filtered.find(restaurant => 
        restaurant.name.toLowerCase() === searchTerm.toLowerCase()
      );
      
      if (exactMatch && !selectedRestaurant) {
        setSelectedRestaurant(exactMatch);
        showNotification(`🍽️ Welcome to ${exactMatch.name}!`, "success");
      }
    }
    
    setFilteredRestaurants(filtered);
  };

  const addToCart = async (foodId, foodName) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Adding to cart - Token exists:", !!token);
      console.log("Adding to cart - Food ID:", foodId);
      console.log("Adding to cart - Food Name:", foodName);
      
      if (!token) {
        showNotification("Please login to add items to cart", "error");
        return;
      }
      
      // Test backend connectivity first
      try {
        console.log("Testing backend connectivity...");
        const testResponse = await api.get("/restaurants");
        console.log("Backend connectivity test - Response:", testResponse.status);
      } catch (testErr) {
        console.error("Backend connectivity test failed:", testErr);
        showNotification("Cannot connect to backend. Please check if server is running.", "error");
        return;
      }
      
      console.log("Making API call to:", `/cart/add?foodId=${foodId}&qty=1`);
      console.log("Authorization header:", `Bearer ${token.substring(0, 20)}...`);
      console.log("Full API URL:", api.defaults.baseURL + `/cart/add?foodId=${foodId}&qty=1`);
      
      const response = await api.post(`/cart/add?foodId=${foodId}&qty=1`);
      console.log("Cart add response:", response.data);
      
      setCartCount(prev => prev + 1);
      showNotification(`✅ ${foodName} added to cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error headers:", err.response?.headers);
      console.error("Full error object:", err);
      
      if (err.response?.status === 401) {
        showNotification("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else if (err.response?.status === 404) {
        showNotification("Food item not found", "error");
      } else if (err.response?.status === 403) {
        showNotification("Access denied. Please check your permissions.", "error");
      } else if (err.code === "NETWORK_ERROR" || err.code === "ERR_NETWORK") {
        showNotification("Network error: Cannot reach backend server. Please check if backend is running on port 8080.", "error");
      } else if (err.message?.includes("Network Error")) {
        showNotification("Network Error: Backend server may be down or unreachable.", "error");
      } else {
        const errorMsg = err.response?.data?.message || err.message || "Failed to add item to cart";
        showNotification(`Error: ${errorMsg}`, "error");
      }
    }
  };

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === "success" ? "#10b981" : "#ef4444"};
      color: white;
      border-radius: 12px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    showNotification(`🍽️ Welcome to ${restaurant.name}!`, "success");
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
  };

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchTerm, selectedCuisine]);

  return (
    <div className="dashboard-page">
      <Header cartCount={cartCount} />
      
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-message">
            <h1 className="welcome-title">
              <span className="welcome-emoji">🎉</span>
              Welcome back, {username}!
              <span className="welcome-emoji">🍽️</span>
            </h1>
            <p className="welcome-subtitle">Ready to explore delicious food?</p>
            <div className="welcome-features">
              <div className="feature-card">
                <span className="feature-icon">🔥</span>
                <span className="feature-text">Hot Deals</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⚡</span>
                <span className="feature-text">Fast Delivery</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">Top Rated</span>
              </div>
            </div>
            <div className="welcome-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span className="progress-text">Loading amazing food...</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCuisine={selectedCuisine}
          setSelectedCuisine={setSelectedCuisine}
          cuisines={["all", "North Indian", "Italian", "Chinese", "South Indian", "Fast Food", "Cafe & Desserts", "Mexican", "Asian Fusion", "Japanese", "Thai", "Continental", "Mediterranean"]}
        />

        {loading ? (
          <LoadingSpinner />
        ) : selectedRestaurant ? (
          <RestaurantMenuView
            restaurant={selectedRestaurant}
            foods={foodsByRestaurant[selectedRestaurant.id] || []}
            onAddToCart={addToCart}
            onBack={handleBackToRestaurants}
            onThankYou={() => setShowThankYou(true)}
          />
        ) : (
          <div className="restaurants-section">
            <h2 className="section-title">
              {selectedCuisine === "all" ? "All Restaurants" : `${selectedCuisine} Cuisine`}
            </h2>
            <div className="restaurants-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => handleRestaurantClick(restaurant)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showThankYou && (
        <div className="thank-you-overlay">
          <div className="thank-you-message">
            <h1 className="thank-you-title">
              <span className="thank-you-emoji">🎉</span>
              Thank you for your order!
              <span className="thank-you-emoji">🍽️</span>
            </h1>
            <p className="thank-you-subtitle">Your food will be delivered soon</p>
            <div className="thank-you-features">
              <div className="feature-card">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Fast Delivery</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">💳</span>
                <span className="feature-text">Secure Payment</span>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">Quality Food</span>
              </div>
            </div>
            <button className="continue-shopping-btn" onClick={() => setShowThankYou(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
