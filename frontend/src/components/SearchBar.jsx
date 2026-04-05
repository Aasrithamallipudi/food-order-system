import { useState } from "react";

export default function SearchBar({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");

  const cuisines = [
    { value: "all", label: "All Cuisines" },
    { value: "North Indian", label: "🌶️ North Indian" },
    { value: "Italian", label: "� Italian" },
    { value: "Chinese", label: "� Chinese" },
    { value: "South Indian", label: "� South Indian" },
    { value: "Fast Food", label: "🍔 Fast Food" },
    { value: "Cafe & Desserts", label: "☕ Cafe & Desserts" },
    { value: "Mexican", label: "🌮 Mexican" },
    { value: "Asian Fusion", label: "🥘 Asian Fusion" },
    { value: "Japanese", label: "🍱 Japanese" },
    { value: "Thai", label: "🍜 Thai" },
    { value: "Continental", label: "🥂 Continental" },
    { value: "Mediterranean", label: "🫒 Mediterranean" }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
    onFilter(cuisine);
  };

  return (
    <div className="search-section">
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for restaurants or dishes..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <label className="filter-label">Filter by Cuisine:</label>
          <select
            value={selectedCuisine}
            onChange={(e) => handleFilter(e.target.value)}
            className="cuisine-filter"
          >
            {cuisines.map((cuisine) => (
              <option key={cuisine.value} value={cuisine.value}>
                {cuisine.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
