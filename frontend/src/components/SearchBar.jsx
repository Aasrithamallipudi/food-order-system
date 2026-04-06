import { useState } from "react";

export default function SearchBar({ searchTerm, setSearchTerm, selectedCuisine, setSelectedCuisine, cuisines }) {
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleFilter = (cuisine) => {
    setSelectedCuisine(cuisine);
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
              <option key={cuisine} value={cuisine}>
                {cuisine === "all" ? "All Cuisines" : cuisine}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
