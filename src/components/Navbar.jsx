import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";

import "./Navbar.css";
import logo from "../assets/logo/logo.png";

import {
  FaHome,
  FaHeart,
  FaBoxOpen,
  FaUser,
  FaShoppingCart,
  FaSignInAlt,
  FaUserShield,
} from "react-icons/fa";

function Navbar() {
  const { cart } = useContext(CartContext);

  const {
    currentUser,
    isAdmin,
    logout,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo">
        <div className="logo-circle">
          <img
            src={logo}
            alt="Foodie Hub"
            className="logo-img"
          />
        </div>
      </Link>

      {/* Navigation */}
      <ul className="nav-menu">
        {/* Home - Everyone */}
        <li>
          <Link to="/" className="nav-link">
            <FaHome />
            <span>Home</span>
          </Link>
        </li>

        {/* Favorites and Orders - Normal users only */}
        {currentUser && !isAdmin && (
          <>
            <li>
              <Link to="/favorites" className="nav-link">
                <FaHeart />
                <span>Favorites</span>
              </Link>
            </li>

            <li>
              <Link to="/my-orders" className="nav-link">
                <FaBoxOpen />
                <span>Orders</span>
              </Link>
            </li>
          </>
        )}

        {/* Admin links - Admin only */}
        {currentUser && isAdmin && (
          <>
            <li>
              <Link to="/admin" className="nav-link">
                <FaUserShield />
                <span>Admin</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/orders" className="nav-link">
                📦
                <span>Manage Orders</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/users" className="nav-link">
                👥
                <span>Manage Users</span>
              </Link>
            </li>

            <li>
              <Link to="/admin/foods" className="nav-link">
                🍽️
                <span>Manage Foods</span>
              </Link>
            </li>
          </>
        )}

        {/* Logged-in user */}
        {currentUser ? (
          <>
            {/* Profile only for normal users */}
            {!isAdmin && (
              <li>
                <Link to="/profile" className="nav-link">
                  <FaUser />
                  <span>Profile</span>
                </Link>
              </li>
            )}

            <li>
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          /* Login - Logged-out users */
          <li>
            <Link to="/login" className="nav-link">
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </li>
        )}

        {/* Cart - Everyone */}
        <li>
          <Link to="/cart" className="cart-icon">
            <FaShoppingCart />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;