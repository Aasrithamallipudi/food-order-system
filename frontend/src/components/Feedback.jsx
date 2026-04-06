import { useState } from "react";

export default function Feedback({ onClose, onSubmit, restaurantName, orderItems }) {
  const [foodQuality, setFoodQuality] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState(0);
  const [packaging, setPackaging] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [wouldOrderAgain, setWouldOrderAgain] = useState("");

  const handleSubmit = () => {
    if (!feedbackText.trim() && foodQuality === 0) {
      alert("Please rate the food quality or provide feedback before submitting.");
      return;
    }

    const feedbackData = {
      restaurantName,
      orderItems,
      ratings: {
        foodQuality,
        deliveryTime,
        packaging
      },
      feedback: feedbackText,
      wouldOrderAgain,
      timestamp: new Date().toISOString()
    };

    // Show success notification
    const notification = document.createElement("div");
    notification.className = "food-feedback-success-notification";
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🍽️</div>
        <div class="notification-text">
          <strong>Thank you for your food feedback!</strong>
          <p>Your feedback helps ${restaurantName} improve their service</p>
        </div>
      </div>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
      max-width: 350px;
      animation: slideInRight 0.5s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .notification-icon {
        font-size: 24px;
      }
      .notification-text strong {
        display: block;
        font-size: 16px;
        margin-bottom: 4px;
      }
      .notification-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
      notification.remove();
      style.remove();
    }, 4000);

    // Call onSubmit callback
    if (onSubmit) {
      onSubmit(feedbackData);
    }

    // Close feedback form
    onClose();
  };

  return (
    <div className="food-feedback-overlay">
      <div className="food-feedback-card">
        <div className="feedback-header">
          <h2>🍽️ Rate Your Food Experience</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="restaurant-info">
          <h3>{restaurantName}</h3>
          <p>How was your food experience?</p>
        </div>

        <div className="feedback-content">
          <div className="rating-section">
            <label>🍕 Food Quality:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= foodQuality ? 'active' : ''}`}
                  onClick={() => setFoodQuality(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="rating-section">
            <label>🚚 Delivery Time:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= deliveryTime ? 'active' : ''}`}
                  onClick={() => setDeliveryTime(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="rating-section">
            <label>📦 Packaging:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= packaging ? 'active' : ''}`}
                  onClick={() => setPackaging(star)}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div className="would-order-section">
            <label>Would you order from {restaurantName} again?</label>
            <div className="radio-buttons">
              <label className="radio-option">
                <input
                  type="radio"
                  value="yes"
                  checked={wouldOrderAgain === "yes"}
                  onChange={(e) => setWouldOrderAgain(e.target.value)}
                />
                <span>😊 Yes, definitely!</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="maybe"
                  checked={wouldOrderAgain === "maybe"}
                  onChange={(e) => setWouldOrderAgain(e.target.value)}
                />
                <span>🤔 Maybe</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  value="no"
                  checked={wouldOrderAgain === "no"}
                  onChange={(e) => setWouldOrderAgain(e.target.value)}
                />
                <span>😞 No</span>
              </label>
            </div>
          </div>

          <div className="feedback-message-section">
            <label>Additional Comments (optional):</label>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us more about your food experience..."
              className="feedback-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="feedback-actions">
          <button className="skip-btn" onClick={onClose}>
            Skip
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            🍽️ Submit Food Feedback
          </button>
        </div>
      </div>

      <style jsx>{`
        .food-feedback-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .food-feedback-card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .feedback-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s;
        }

        .close-btn:hover {
          background: #f0f0f0;
          color: #333;
        }

        .restaurant-info {
          text-align: center;
          margin-bottom: 25px;
          padding: 15px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border-radius: 12px;
        }

        .restaurant-info h3 {
          margin: 0 0 5px 0;
          font-size: 20px;
        }

        .restaurant-info p {
          margin: 0;
          opacity: 0.9;
        }

        .feedback-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .rating-section,
        .would-order-section,
        .feedback-message-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rating-section label,
        .would-order-section label,
        .feedback-message-section label {
          font-weight: 600;
          color: #333;
        }

        .star-rating {
          display: flex;
          gap: 8px;
        }

        .star-btn {
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          transition: all 0.2s;
          opacity: 0.3;
        }

        .star-btn:hover {
          opacity: 0.6;
          transform: scale(1.1);
        }

        .star-btn.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .radio-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.3s;
        }

        .radio-option:hover {
          background-color: #f8f9fa;
        }

        .radio-option input[type="radio"] {
          margin: 0;
        }

        .feedback-textarea {
          padding: 12px;
          border: 2px solid #e1e5e9;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s;
        }

        .feedback-textarea:focus {
          outline: none;
          border-color: #ff6b6b;
        }

        .feedback-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 25px;
        }

        .skip-btn {
          padding: 12px 24px;
          border: 2px solid #6c757d;
          background: white;
          color: #6c757d;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .skip-btn:hover {
          background: #6c757d;
          color: white;
        }

        .submit-btn {
          padding: 12px 24px;
          border: none;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 107, 107, 0.3);
        }
      `}</style>
    </div>
  );
}
