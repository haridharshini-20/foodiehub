import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-section">
          <h2>🍽 Taste of India</h2>

          <p>
            Discover the rich flavors of India with our
            authentic dishes made with love.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/my-orders">My Orders</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>📧 tasteofindia@gmail.com</p>
          <p>📞 +91 98765 43210</p>
          <p>📍 Tamil Nadu, India</p>
        </div>

      </div>

      <div className="footer-bottom">
  © 2025 Taste of India. All Rights Reserved.
</div>

    </footer>
  );
}

export default Footer;