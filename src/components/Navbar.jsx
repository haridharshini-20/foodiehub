import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

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
  FaBars,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";

function Navbar() {
  const { cart } = useContext(CartContext);

  const {
    currentUser,
    isAdmin,
    logout,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="logo" onClick={closeMenu}>
        <div className="logo-circle">
          <img
            src={logo}
            alt="Foodie Hub"
            className="logo-img"
          />
        </div>
      </Link>


      {/* MOBILE MENU BUTTON */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={
          menuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>


      {/* NAVIGATION MENU */}
      <ul
        className={`nav-menu ${
          menuOpen ? "nav-menu-open" : ""
        }`}
      >

        {/* HOME */}
        <li>
          <Link
            to="/"
            className="nav-link"
            onClick={closeMenu}
          >
            <FaHome />
            <span>Home</span>
          </Link>
        </li>


        {/* NORMAL USER */}
        {currentUser && !isAdmin && (
          <>
            <li>
              <Link
                to="/favorites"
                className="nav-link"
                onClick={closeMenu}
              >
                <FaHeart />
                <span>Favorites</span>
              </Link>
            </li>

            <li>
              <Link
                to="/my-orders"
                className="nav-link"
                onClick={closeMenu}
              >
                <FaBoxOpen />
                <span>Orders</span>
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className="nav-link"
                onClick={closeMenu}
              >
                <FaUser />
                <span>Profile</span>
              </Link>
            </li>
          </>
        )}


        {/* ADMIN */}
        {currentUser && isAdmin && (
          <>
            <li>
              <Link
                to="/admin"
                className="nav-link"
                onClick={closeMenu}
              >
                <FaUserShield />
                <span>Admin</span>
              </Link>
            </li>

            <li>
              <Link
                to="/kitchen"
                className="nav-link"
                onClick={closeMenu}
              >
                <FaUtensils />
                <span>Kitchen Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/orders"
                className="nav-link"
                onClick={closeMenu}
              >
                📦
                <span>Manage Orders</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/users"
                className="nav-link"
                onClick={closeMenu}
              >
                👥
                <span>Manage Users</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/foods"
                className="nav-link"
                onClick={closeMenu}
              >
                🍽️
                <span>Manage Foods</span>
              </Link>
            </li>
          </>
        )}


        {/* LOGIN / LOGOUT */}
        {currentUser ? (
          <li>
            <button
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link
              to="/login"
              className="nav-link"
              onClick={closeMenu}
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </li>
        )}

      </ul>


      {/* CART — OUTSIDE THE MENU */}
      <Link
        to="/cart"
        className="cart-icon"
        onClick={closeMenu}
        aria-label={`Cart with ${cartCount} items`}
      >
        <FaShoppingCart />

        {cartCount > 0 && (
          <span className="cart-count">
            {cartCount}
          </span>
        )}
      </Link>

    </nav>
  );
}

export default Navbar;