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
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    loadRestaurants();
    loadCartCount();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await api.get("/restaurants");
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);

      for (const r of res.data) {
        const foodsRes = await api.get(`/restaurants/${r.id}/foods`);
        setFoodsByRestaurant((prev) => ({
          ...prev,
          [r.id]: foodsRes.data,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    try {
      const res = await api.get("/cart");
      setCartCount(res.data?.items?.length || 0);
    } catch (err) {
      console.error(err);
    }
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (selectedCuisine !== "all") {
      filtered = filtered.filter(
        (r) =>
          r.cuisine.toLowerCase() === selectedCuisine.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  };

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchTerm, selectedCuisine]);

  const addToCart = async (foodId, foodName) => {
    try {
      await api.post(`/cart/add?foodId=${foodId}&qty=1`);
      setCartCount((prev) => prev + 1);
      alert(`${foodName} added to cart`);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ FIXED LOADING RETURN
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-page">
      <Header cartCount={cartCount} />

      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="welcome-overlay">
          <h2>Welcome, {username}!</h2>
        </div>
      )}

      {/* Thank You Overlay */}
      {showThankYou && (
        <div className="thank-you-overlay">
          <h2>Thank you for your order!</h2>
        </div>
      )}

      <div className="dashboard-content">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCuisine={selectedCuisine}
          setSelectedCuisine={setSelectedCuisine}
          cuisines={["all", "Indian", "Italian", "Chinese"]}
        />

        {selectedRestaurant ? (
          <RestaurantMenuView
            restaurant={selectedRestaurant}
            foods={foodsByRestaurant[selectedRestaurant.id] || []}
            onBack={() => setSelectedRestaurant(null)}
            onAddToCart={addToCart}
            onThankYou={() => setShowThankYou(true)}
          />
        ) : (
          <div className="restaurants-grid">
            {filteredRestaurants.map((r) => (
              <RestaurantCard
                key={r.id}
                restaurant={r}
                onClick={() => setSelectedRestaurant(r)}
              />
            ))}
          </div>
        )}

        {filteredRestaurants.length === 0 && (
          <p>No restaurants found</p>
        )}
      </div>
    </div>
  );
}