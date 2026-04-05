export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner">
        <div className="food-icon">🍕</div>
        <div className="food-icon">🍔</div>
        <div className="food-icon">🍟</div>
        <div className="food-icon">🌮</div>
      </div>
      <p className="loading-text">Loading delicious restaurants...</p>
    </div>
  );
}
