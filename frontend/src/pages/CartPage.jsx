import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [loading, setLoading] = useState(true);

  // Load cart from local storage for guest users, or from backend for logged-in users
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (token) {
        // Logged-in user: load from backend
        const res = await api.get("/cart");
        console.log("Cart data from backend:", res.data);
        setItems(res.data);
      } else {
        // Guest user: load from local storage
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          const cartItems = JSON.parse(guestCart);
          console.log("Cart data from local storage:", cartItems);
          setItems(cartItems);
        }
      }
    } catch (err) {
      console.error("Error loading cart:", err);
      if (err.response?.status === 401) {
        console.log("User not authenticated, trying guest cart");
        // Fallback to guest cart
        const guestCart = localStorage.getItem("guestCart");
        if (guestCart) {
          setItems(JSON.parse(guestCart));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const subtotal = useMemo(
    () => items.reduce((sum, i) => {
      // Handle both guest cart (direct foodItem) and backend cart (nested foodItem)
      const price = i.foodItem ? i.foodItem.price : i.price;
      return sum + (price * i.quantity);
    }, 0),
    [items]
  );

  const deliveryFee = 40;
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + deliveryFee + tax;

  const removeItem = async (id) => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        // Logged-in user: remove from backend
        await api.delete(`/cart/${id}`);
      } else {
        // Guest user: remove from local storage
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const updatedCart = guestCart.filter(item => item.id !== id);
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      }
      
      await loadCart();
      alert("Item removed from cart");
    } catch (err) {
      alert("Failed to remove item");
    }
  };

  const checkout = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to place order");
      return;
    }
    
    try {
      console.log("Processing payment...");
      console.log("Address:", address);
      console.log("Payment Method:", paymentMethod);
      
      const response = await api.post("/orders/checkout", { 
        deliveryAddress: address, 
        paymentMethod: paymentMethod 
      });
      
      console.log("Payment response:", response.data);
      alert("✅ Payment successful! Order placed.");
      setAddress("");
      await loadCart();
      
      // Redirect to orders page
      window.location.href = "/orders";
      
    } catch (err) {
      console.error("Payment error:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.status === 401) {
        alert("Please login to place order");
      } else if (err.response?.status === 400) {
        alert("Your cart is empty. Please add items to cart first.");
      } else {
        alert("Payment failed: " + (err.response?.data?.message || "Please try again."));
      }
    }
  };

  return (
    <div className="page">
      <header className="topbar">
        <h2>🛒 Your Cart</h2>
        <Link to="/" className="btn-secondary">← Back To Menu</Link>
      </header>

      {loading ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#718096'}}>
          Loading cart...
        </div>
      ) : items.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', marginTop: '20px'}}>
          <p style={{fontSize: '48px', margin: '16px 0'}}>🛍️</p>
          <h3 style={{color: '#2d3748'}}>Your cart is empty</h3>
          <p style={{color: '#a0aec0', marginBottom: '20px'}}>Add some delicious food items to get started!</p>
          <Link to="/" className="btn-secondary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => {
              // Handle both guest cart (direct foodItem) and backend cart (nested foodItem)
              const foodItem = item.foodItem || item;
              const itemId = item.foodItem ? item.id : item.id;
              
              return (
                <div key={itemId} className="cart-item">
                  <div style={{flex: 1}}>
                    <h4 style={{margin: '0 0 8px 0', color: '#1a202c'}}>{foodItem.name}</h4>
                    <p style={{margin: '4px 0', color: '#a0aec0', fontSize: '14px'}}>
                      Quantity: <strong>{item.quantity}</strong> × ₹{foodItem.price.toFixed(2)}
                    </p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <strong style={{display: 'block', marginBottom: '8px', color: '#667eea', fontSize: '16px'}}>
                      ₹ {(foodItem.price * item.quantity).toFixed(2)}
                    </strong>
                    <button 
                      onClick={() => removeItem(itemId)}
                      style={{
                        width: 'auto',
                        padding: '6px 12px',
                        background: '#fed7d7',
                        color: '#c53030',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}
                    >
                      🗑️ Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="checkout-box">
            <h3 style={{color: '#1a202c', marginBottom: '16px'}}>💳 Order Summary</h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '12px',
              color: '#718096'
            }}>
              <span>Subtotal:</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
              marginBottom: '12px',
              color: '#718096'
            }}>
              <span>Delivery Fee:</span>
              <span>₹ {deliveryFee.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '16px',
              color: '#718096'
            }}>
              <span>Tax (5%):</span>
              <span>₹ {tax.toFixed(2)}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '20px',
              fontWeight: '700',
              color: '#667eea',
              marginBottom: '20px'
            }}>
              <span>Total:</span>
              <span>₹ {total.toFixed(2)}</span>
            </div>

            <textarea
              placeholder="📍 Enter your delivery address... (e.g., 123 Main St, Apt 4B, City)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>💳 UPI / Digital Wallet</option>
              <option>🏦 Credit / Debit Card</option>
              <option>🚚 Cash On Delivery</option>
            </select>

            <button onClick={checkout} style={{fontSize: '16px', fontWeight: '700'}}>
              ✓ Pay & Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
