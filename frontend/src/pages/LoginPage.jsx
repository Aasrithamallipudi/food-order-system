import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const payload = isRegister ? { fullName, email, password } : { email, password };
      
      console.log("Submitting to:", endpoint);
      console.log("Payload:", payload);
      
      const res = await api.post(endpoint, payload);
      
      console.log("Response:", res.data);
      
      // Store token and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.fullName || res.data.username || email.split('@')[0]);
      
      console.log("Token stored:", res.data.token);
      console.log("Username stored:", res.data.fullName || res.data.username || email.split('@')[0]);
      
      // Show success message
      alert(isRegister ? "✅ Registration successful! Welcome to FoodExpress!" : "✅ Login successful!");
      
      // Navigate to restaurants page (dashboard)
      navigate("/");
      
    } catch (err) {
      console.error("Auth error:", err);
      console.error("Error response:", err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                         (isRegister ? "Registration failed. Email may already exist." : "Login failed. Check your credentials.");
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🍽️ FoodExpress</h1>
        
        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : (isRegister ? "Sign Up" : "Sign In")}
        </button>
        
        <p>
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
