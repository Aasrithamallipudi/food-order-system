import React from "react";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div className="restaurant-card" onClick={onClick}>
      
      <img
        src={restaurant.imageUrl}
        alt={restaurant.name}
        className="restaurant-img"
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/${restaurant.name}/480/240.jpg`;
        }}
      />

      <div className="restaurant-info">
        <h3>{restaurant.name}</h3>
        <p>{restaurant.cuisine}</p>

        <div className="restaurant-meta">
          <span className="rating">⭐ {restaurant.rating}</span>
        </div>
      </div>

    </div>
  );
}