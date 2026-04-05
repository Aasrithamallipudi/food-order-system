import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
    // Set up real-time listener for admin updates
    const interval = setInterval(() => {
      loadOrders();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      
      if (token) {
        const res = await api.get("/orders");
        setOrders(res.data);
        // Also update localStorage for consistency
        localStorage.setItem("userOrders", JSON.stringify(res.data));
      } else {
        // For guest users, load from localStorage or show empty state
        const guestOrders = JSON.parse(localStorage.getItem("guestOrders") || "[]");
        setOrders(guestOrders);
      }
      
      // Check for admin updates and merge if needed
      const adminOrders = JSON.parse(localStorage.getItem("adminOrders") || "[]");
      if (adminOrders.length > 0) {
        // Merge admin orders with user orders (for demo purposes)
        const mergedOrders = [...res.data, ...adminOrders];
        setOrders(mergedOrders);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "#f59e0b";
      case "PREPARING": return "#3b82f6";
      case "OUT_FOR_DELIVERY": return "#8b5cf6";
      case "DELIVERED": return "#10b981";
      case "CANCELLED": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return "⏳";
      case "PREPARING": return "👨‍🍳";
      case "OUT_FOR_DELIVERY": return "🚚";
      case "DELIVERED": return "✅";
      case "CANCELLED": return "❌";
      default: return "📋";
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="orders-header">
        <h2>📋 My Orders</h2>
        <p>Track and manage your food orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No orders yet</h3>
          <p>Start ordering from your favorite restaurants!</p>
          <a href="/" className="cta-button">
            Browse Restaurants
          </a>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h4>Order #{order.id}</h4>
                  <p className="order-date">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div 
                  className="order-status"
                  style={{ color: getStatusColor(order.status) }}
                >
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  <span className="status-text">{order.status}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items?.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.foodItem?.name || item.name || 'Unknown Item'}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">₹{(item.itemPrice || item.price || 0 * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total: </span>
                  <span className="total-amount">₹{order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="order-actions">
                  <button className="track-btn">📍 Track Order</button>
                  <button className="reorder-btn">🔄 Reorder</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
