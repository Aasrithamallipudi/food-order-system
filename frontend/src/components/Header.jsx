import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ cartCount = 0 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        setProfileImage(imageData);
        localStorage.setItem("profileImage", imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImage("");
    localStorage.removeItem("profileImage");
  };

  return (
    <header className="modern-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">FoodExpress</span>
          </Link>
          <p className="tagline">Delicious food delivered fast</p>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            🏠 Home
          </Link>
          <Link to="/orders" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            📋 Orders
          </Link>
          <Link to="/cart" className="nav-link cart-link" onClick={() => setIsMenuOpen(false)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>

        <div className="header-right">
          <div className="user-menu">
            <div className="profile-section">
              {profileImage ? (
                <div className="profile-image-container">
                  <img src={profileImage} alt="Profile" className="profile-image" />
                  <div className="profile-dropdown">
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-btn">
                      👤 {username}
                    </button>
                    {isProfileOpen && (
                      <div className="profile-menu">
                        <button onClick={handleRemoveProfileImage} className="profile-option">
                          🗑️ Remove Profile Picture
                        </button>
                        <label className="profile-option">
                          📷 Change Profile Picture
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            style={{display: 'none'}}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="profile-placeholder">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="profile-btn">
                    👤 {username}
                  </button>
                  {isProfileOpen && (
                    <div className="profile-menu">
                      <label className="profile-option">
                        📷 Upload Profile Picture
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          style={{display: 'none'}}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </button>
          </div>
          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
