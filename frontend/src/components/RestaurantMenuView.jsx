import { useState, useEffect } from "react";

export default function RestaurantMenuView({ restaurant, foods, onBack, onAddToCart, onThankYou }) {
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [reviewText, setReviewText] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  
  // UPI details state
  const [upiId, setUpiId] = useState("");
  
  // Wallet details state
  const [walletNumber, setWalletNumber] = useState("");
  const [walletPin, setWalletPin] = useState("");

  // Load cart from localStorage for guest users on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      const guestCart = localStorage.getItem("guestCart");
      if (guestCart) {
        const cartItems = JSON.parse(guestCart);
        setCartItems(cartItems);
        console.log("Loaded guest cart from localStorage:", cartItems);
      }
    }
  }, []);

  const handleAddToCart = (food) => {
    console.log("Adding food to cart:", food);
    console.log("Food ID:", food.id);
    console.log("Food name:", food.name);
    
    // Add to local cart state (works for both logged-in and guest users)
    const existingItem = cartItems.find(item => item.id === food.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cartItems.map(item => 
        item.id === food.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...food, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    
    // Save to localStorage for guest users
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      console.log("Guest cart saved to localStorage:", updatedCart);
    }
    
    // Only call backend if user is logged in
    if (token) {
      console.log("Calling backend addToCart with foodId:", food.id);
      onAddToCart(food.id, food.name);
    } else {
      console.log("User not logged in, using local cart only");
    }
    
    // Show success message
    alert(`✅ ${food.name} added to cart successfully!`);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowCheckout(true);
  };

  const handlePayment = () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter delivery address");
      return;
    }

    // Generate order details
    const order = {
      id: `#ORD${Date.now()}`,
      items: cartItems,
      subtotal: getTotalPrice(),
      deliveryFee: 40,
      tax: Math.round(getTotalPrice() * 0.05),
      total: getTotalPrice() + 40 + Math.round(getTotalPrice() * 0.05),
      deliveryAddress: deliveryAddress,
      restaurant: restaurant.name,
      orderDate: new Date().toLocaleString(),
      estimatedDelivery: "30-45 minutes"
    };
    
    setOrderDetails(order);

    // Show payment form for non-COD methods
    if (paymentMethod === "cod") {
      // For COD, process directly
      processPayment(order);
    } else {
      // Show payment form for other methods
      setShowCheckout(false);
      setShowPaymentForm(true);
    }
  };

  const processPayment = async (order) => {
    setShowPaymentForm(false);
    setIsProcessingPayment(true);

    try {
      console.log("Processing payment...");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dummy payment processing logic
      const paymentSuccess = await processDummyPayment(paymentMethod, order.total);
      
      if (paymentSuccess) {
        setOrderDetails(order);
        setShowPaymentSuccess(true);
        // Clear cart after successful payment
        setCartItems([]);
        localStorage.removeItem("guestCart");
        
        // Hide payment success after 3 seconds and show bill
        setTimeout(() => {
          setShowPaymentSuccess(false);
          setShowBill(true);
        }, 3000);
      } else {
        alert("Payment failed. Please try again.");
        setShowCheckout(true);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setShowCheckout(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSubmit = () => {
    // Validate payment details based on method
    if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        alert("Please fill all card details");
        return;
      }
      if (cardNumber.length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return;
      }
      if (cardCVV.length !== 3) {
        alert("Please enter a valid 3-digit CVV");
        return;
      }
    } else if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        alert("Please enter a valid UPI ID");
        return;
      }
    } else if (paymentMethod === "wallet") {
      if (!walletNumber || walletNumber.length !== 10) {
        alert("Please enter a valid 10-digit wallet number");
        return;
      }
      if (!walletPin || walletPin.length !== 4) {
        alert("Please enter a valid 4-digit PIN");
        return;
      }
    }

    // Process payment with order details
    processPayment(orderDetails);
  };

  const processDummyPayment = async (method, amount) => {
    // Dummy payment processing logic
    console.log(`Processing ${method} payment of ₹${amount.toFixed(2)}`);
    
    // Simulate different payment methods
    switch (method) {
      case "cod":
        console.log("Cash on Delivery - Payment confirmed");
        return true;
      
      case "card":
        console.log("Card Payment - Processing...");
        // Simulate card validation
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      
      case "upi":
        console.log("UPI Payment - Processing...");
        // Simulate UPI verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        return true;
      
      case "wallet":
        console.log("Wallet Payment - Processing...");
        // Simulate wallet balance check
        await new Promise(resolve => setTimeout(resolve, 800));
        return true;
      
      default:
        return false;
    }
  };

  const handleReviewSubmit = () => {
    setShowReview(false);
    onThankYou();
    setCartItems([]);
  };

  const handleBackToMenu = () => {
    setShowReview(false);
  };

  if (showReview) {
    return (
      <div className="review-flow">
        <div className="review-card">
          <h2>⭐ Rate Your Experience</h2>
          <p>How was your order from {restaurant.name}?</p>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this restaurant..."
            className="review-textarea"
          />
          <div className="review-actions">
            <button onClick={handleBackToMenu} className="back-btn">
              ← Back to Menu
            </button>
            <button onClick={handleReviewSubmit} className="submit-review-btn">
              ⭐ Submit Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isProcessingPayment) {
    return (
      <div className="payment-processing-overlay">
        <div className="payment-processing-card">
          <div className="payment-spinner">
            <div className="spinner"></div>
          </div>
          <h2>Processing Payment...</h2>
          <p>Please wait while we process your {paymentMethod === "cod" ? "order" : "payment"}</p>
          <div className="payment-method-display">
            <span className="payment-method-icon">
              {paymentMethod === "cod" && "💵"}
              {paymentMethod === "card" && "💳"}
              {paymentMethod === "upi" && "📱"}
              {paymentMethod === "wallet" && "👛"}
            </span>
            <span className="payment-method-text">
              {paymentMethod === "cod" && "Cash on Delivery"}
              {paymentMethod === "card" && "Credit/Debit Card"}
              {paymentMethod === "upi" && "UPI/PayTM"}
              {paymentMethod === "wallet" && "Wallet"}
            </span>
          </div>
          <div className="payment-amount">
            Amount: ₹{getTotalPrice().toFixed(2)}
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentSuccess) {
    return (
      <div className="payment-success-overlay">
        <div className="payment-success-card">
          <div className="success-animation">
            <div className="success-checkmark">✓</div>
          </div>
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully</p>
          <div className="order-details">
            <div className="detail-item">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">#ORD{Date.now()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Amount Paid:</span>
              <span className="detail-value">₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">
                {paymentMethod === "cod" && "Cash on Delivery"}
                {paymentMethod === "card" && "Card Payment"}
                {paymentMethod === "upi" && "UPI Payment"}
                {paymentMethod === "wallet" && "Wallet"}
              </span>
            </div>
          </div>
          <div className="success-message">
            🎉 Thank you for your order! Your food will be delivered soon.
          </div>
        </div>
      </div>
    );
  }

  if (showPaymentForm) {
    return (
      <div className="payment-form-overlay">
        <div className="payment-form-card">
          <h2>💳 Payment Details</h2>
          <p className="payment-subtitle">Enter your {paymentMethod === "card" ? "card" : paymentMethod === "upi" ? "UPI" : "wallet"} details</p>
          
          {paymentMethod === "card" && (
            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ""))}
                  maxLength={16}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    maxLength={5}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    maxLength={3}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === "upi" && (
            <div className="upi-form">
              <div className="form-group">
                <label>UPI ID</label>
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="upi-apps">
                <p>Available UPI Apps:</p>
                <div className="upi-icons">
                  <span>📱 GPay</span>
                  <span>📱 PhonePe</span>
                  <span>📱 PayTM</span>
                  <span>📱 Amazon Pay</span>
                </div>
              </div>
            </div>
          )}
          
          {paymentMethod === "wallet" && (
            <div className="wallet-form">
              <div className="form-group">
                <label>Wallet Number</label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={walletNumber}
                  onChange={(e) => setWalletNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={10}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Wallet PIN</label>
                <input
                  type="password"
                  placeholder="****"
                  value={walletPin}
                  onChange={(e) => setWalletPin(e.target.value.replace(/\D/g, ""))}
                  maxLength={4}
                  className="form-input"
                />
              </div>
              <div className="wallet-options">
                <p>Supported Wallets:</p>
                <div className="wallet-icons">
                  <span>👛 PayTM Wallet</span>
                  <span>👛 PhonePe Wallet</span>
                  <span>👛 Amazon Pay Balance</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="payment-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{orderDetails?.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{orderDetails?.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{orderDetails?.tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{orderDetails?.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="payment-actions">
            <button onClick={() => setShowCheckout(true)} className="back-btn">
              ← Back
            </button>
            <button onClick={handlePaymentSubmit} className="pay-btn">
              💳 Pay ₹{orderDetails?.total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showBill) {
    return (
      <div className="bill-overlay">
        <div className="bill-card">
          <div className="bill-header">
            <h2>🧾 Payment Bill</h2>
            <div className="bill-status success">✓ PAID</div>
          </div>
          
          <div className="bill-section">
            <h3>Order Details</h3>
            <div className="bill-row">
              <span>Order ID:</span>
              <span>{orderDetails?.id}</span>
            </div>
            <div className="bill-row">
              <span>Restaurant:</span>
              <span>{orderDetails?.restaurant}</span>
            </div>
            <div className="bill-row">
              <span>Order Date:</span>
              <span>{orderDetails?.orderDate}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Address:</span>
              <span>{orderDetails?.deliveryAddress}</span>
            </div>
            <div className="bill-row">
              <span>Estimated Delivery:</span>
              <span>{orderDetails?.estimatedDelivery}</span>
            </div>
          </div>
          
          <div className="bill-section">
            <h3>Payment Information</h3>
            <div className="bill-row">
              <span>Payment Method:</span>
              <span>
                {paymentMethod === "cod" && "Cash on Delivery"}
                {paymentMethod === "card" && `Card ending in ****${cardNumber.slice(-4)}`}
                {paymentMethod === "upi" && `UPI: ${upiId}`}
                {paymentMethod === "wallet" && `Wallet: ${walletNumber}`}
              </span>
            </div>
            <div className="bill-row">
              <span>Payment Status:</span>
              <span className="status-success">✓ Successful</span>
            </div>
          </div>
          
          <div className="bill-section">
            <h3>Order Items</h3>
            {orderDetails?.items.map((item, index) => (
              <div key={index} className="bill-item-row">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="bill-section bill-totals">
            <div className="bill-row">
              <span>Subtotal:</span>
              <span>₹{orderDetails?.subtotal.toFixed(2)}</span>
            </div>
            <div className="bill-row">
              <span>Delivery Fee:</span>
              <span>₹{orderDetails?.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="bill-row">
              <span>Tax (5%):</span>
              <span>₹{orderDetails?.tax.toFixed(2)}</span>
            </div>
            <div className="bill-row total-row">
              <span>Total Paid:</span>
              <span>₹{orderDetails?.total.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bill-footer">
            <p>Thank you for your order! 🎉</p>
            <p>Keep this bill for your records.</p>
          </div>
          
          <div className="bill-actions">
            <button onClick={() => window.print()} className="print-btn">
              🖨️ Print Bill
            </button>
            <button onClick={() => {
              setShowBill(false);
              setShowReview(true);
            }} className="continue-btn">
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className="checkout-flow">
        <div className="checkout-card">
          <h2>🛒 Checkout</h2>
          
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item, index) => (
              <div key={index} className="checkout-item">
                <span>{item.name} x{item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="total-price">
              <strong>Total: ₹{getTotalPrice().toFixed(2)}</strong>
            </div>
          </div>

          <div className="delivery-details">
            <h3>📍 Delivery Details</h3>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your complete delivery address..."
              className="address-input"
            />
          </div>

          <div className="payment-method">
            <h3>💳 Payment Method</h3>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-select"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI/PayTM</option>
              <option value="wallet">Wallet</option>
            </select>
          </div>

          <div className="checkout-actions">
            <button onClick={() => setShowCheckout(false)} className="back-btn">
              ← Back to Cart
            </button>
            <button onClick={handlePayment} className="pay-btn">
              💳 Pay Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="restaurant-menu-view">
      {/* Restaurant Header */}
      <div className="restaurant-header">
        <button onClick={onBack} className="back-btn">
          <span className="back-icon">←</span>
          <span className="back-text">Back to Restaurants</span>
        </button>
        <div className="restaurant-info">
          <h2>{restaurant.name}</h2>
          <p>{restaurant.cuisine} • ⭐ {restaurant.rating}</p>
        </div>
        <div className="cart-summary">
          <span className="cart-count">🛒 {cartItems.length} items</span>
          <span className="cart-total">₹{getTotalPrice().toFixed(2)}</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="menu-items-grid">
        {foods.map((food) => (
          <div key={food.id} className="menu-item-card">
            <div className="food-image-container">
              <img src={food.imageUrl} alt={food.name} className="food-image" />
              <div className="food-badge">Popular</div>
            </div>
            <div className="food-details">
              <h3>{food.name}</h3>
              <p className="food-description">{food.description}</p>
              <p className="food-ingredients">🥘 Ingredients: Fresh, high-quality ingredients</p>
              <div className="food-meta">
                <span className="food-price">₹{food.price.toFixed(2)}</span>
                <span className="prep-time">⏱️ 20-30 min</span>
              </div>
              <button 
                onClick={() => handleAddToCart(food)}
                className="add-to-cart-btn"
              >
                <span className="btn-icon">➕</span>
                <span className="btn-text">Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <button onClick={handleCheckout} className="floating-cart-btn">
          🛒 View Cart ({cartItems.length})
        </button>
      )}
    </div>
  );
}

// Add CSS styles for payment components
const styles = `
  .payment-processing-overlay {
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
  }

  .payment-processing-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .payment-spinner {
    margin-bottom: 20px;
  }

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .payment-processing-card h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 24px;
  }

  .payment-processing-card p {
    color: #666;
    margin-bottom: 20px;
  }

  .payment-method-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .payment-method-icon {
    font-size: 24px;
  }

  .payment-method-text {
    font-weight: 600;
    color: #333;
  }

  .payment-amount {
    font-size: 18px;
    font-weight: bold;
    color: #4CAF50;
  }

  .payment-success-overlay {
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
  }

  .payment-success-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.5s ease-out;
  }

  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .success-animation {
    margin-bottom: 20px;
  }

  .success-checkmark {
    width: 80px;
    height: 80px;
    background: #4CAF50;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 40px;
    color: white;
    animation: scaleIn 0.5s ease-out;
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  .payment-success-card h2 {
    color: #4CAF50;
    margin-bottom: 10px;
    font-size: 28px;
  }

  .payment-success-card p {
    color: #666;
    margin-bottom: 20px;
    font-size: 16px;
  }

  .order-details {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: left;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 5px 0;
  }

  .detail-item:last-child {
    margin-bottom: 0;
    border-top: 1px solid #e9ecef;
    padding-top: 15px;
    font-weight: 600;
  }

  .detail-label {
    color: #666;
    font-weight: 500;
  }

  .detail-value {
    color: #333;
    font-weight: 600;
  }

  .success-message {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px;
    border-radius: 8px;
    font-weight: 600;
    margin-top: 20px;
  }

  /* Payment Form Styles */
  .payment-form-overlay {
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

  .payment-form-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .payment-form-card h2 {
    color: #333;
    margin-bottom: 10px;
    text-align: center;
  }

  .payment-subtitle {
    color: #666;
    text-align: center;
    margin-bottom: 25px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: #333;
    font-weight: 600;
  }

  .form-input {
    width: 100%;
    padding: 12px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s;
  }

  .form-input:focus {
    outline: none;
    border-color: #4CAF50;
  }

  .form-row {
    display: flex;
    gap: 15px;
  }

  .form-row .form-group {
    flex: 1;
  }

  .upi-apps, .wallet-options {
    margin-top: 20px;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .upi-apps p, .wallet-options p {
    margin-bottom: 10px;
    font-weight: 600;
    color: #333;
  }

  .upi-icons, .wallet-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .upi-icons span, .wallet-icons span {
    background: white;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #e1e5e9;
  }

  .payment-summary {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666;
  }

  .summary-row.total {
    border-top: 2px solid #e1e5e9;
    padding-top: 10px;
    font-weight: bold;
    color: #333;
    font-size: 18px;
  }

  .payment-actions {
    display: flex;
    gap: 15px;
    margin-top: 25px;
  }

  .payment-actions .back-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid #6c757d;
    background: white;
    color: #6c757d;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .payment-actions .pay-btn {
    flex: 2;
    padding: 12px;
    border: none;
    background: #4CAF50;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 16px;
  }

  /* Bill Styles */
  .bill-overlay {
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

  .bill-card {
    background: white;
    border-radius: 16px;
    padding: 30px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .bill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e1e5e9;
  }

  .bill-header h2 {
    color: #333;
    margin: 0;
  }

  .bill-status.success {
    background: #4CAF50;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
  }

  .bill-section {
    margin-bottom: 25px;
  }

  .bill-section h3 {
    color: #333;
    margin-bottom: 15px;
    font-size: 18px;
  }

  .bill-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 8px 0;
  }

  .bill-item-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 5px 0;
    color: #666;
  }

  .status-success {
    color: #4CAF50;
    font-weight: 600;
  }

  .bill-totals {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
  }

  .total-row {
    border-top: 2px solid #e1e5e9;
    padding-top: 15px;
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }

  .bill-footer {
    text-align: center;
    margin: 25px 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
  }

  .bill-footer p {
    margin: 5px 0;
  }

  .bill-actions {
    display: flex;
    gap: 15px;
  }

  .print-btn {
    flex: 1;
    padding: 12px;
    border: 2px solid #6c757d;
    background: white;
    color: #6c757d;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .continue-btn {
    flex: 2;
    padding: 12px;
    border: none;
    background: #4CAF50;
    color: white;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  @media print {
    .bill-actions {
      display: none;
    }
    
    .bill-overlay {
      position: static;
      background: white;
      padding: 0;
    }
    
    .bill-card {
      box-shadow: none;
      border: none;
    }
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
