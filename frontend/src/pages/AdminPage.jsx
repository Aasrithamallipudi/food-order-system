import { useState, useEffect } from "react";
import api from "../api";

export default function AdminPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const restaurantsRes = await api.get("/restaurants");
      setRestaurants(restaurantsRes.data);
    } catch (err) {
      console.error("Error loading restaurants:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🍽️ Admin Dashboard</h1>
        <p>Manage your food delivery platform</p>
      </div>

      <div className="admin-tabs">
        <button className="tab-btn active">🍕 Restaurants ({restaurants.length})</button>
        <button className="tab-btn">📋 Orders</button>
        <button className="tab-btn">📊 Analytics</button>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="loading-spinner"></div>
          <p>Loading restaurants...</p>
        </div>
      ) : (
        <div className="admin-section">
          <div className="section-header">
            <h2>🍕 Restaurant Management</h2>
            <button className="action-btn" onClick={loadData}>
              🔄 Refresh Data
            </button>
          </div>
          
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="restaurant-card">
                <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-img" />
                <div className="restaurant-info">
                  <h3>{restaurant.name}</h3>
                  <p>{restaurant.cuisine}</p>
                  <div className="restaurant-meta">
                    <span className="rating">⭐ {restaurant.rating}</span>
                    <span className={`status ${restaurant.active ? 'active' : 'inactive'}`}>
                      {restaurant.active ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                  <div className="restaurant-actions">
                    <button className="status-btn">
                      {restaurant.active ? '🔒 Deactivate' : '🔔 Activate'}
                    </button>
                    <button className="delete-btn">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
