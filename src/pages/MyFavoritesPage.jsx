import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoriteContext } from "../contexts/FavoriteContext";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import "./MyFavoritesPage.css";

function MyFavoritesPage() {
  const { favorites, removeFavorite } = useContext(FavoriteContext);
  const { addToCart } = useContext(CartContext);
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <section className="favorites-page">
        <div className="favorites-login">
          <div className="favorites-icon">❤️</div>

          <h2>My Favorites</h2>

          <p>Please login to view your favorite foods.</p>

          <Link to="/login" className="favorites-login-btn">
            Login
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="favorites-page">

      {/* Header */}
      <div className="favorites-header">
        <h1>❤️ My Favorites</h1>

        <p>
          Your favorite dishes, all in one place
        </p>
      </div>

      {/* Empty Favorites */}
      {favorites.length === 0 ? (
        <div className="empty-favorites">

          <div className="empty-favorites-icon">
            💔
          </div>

          <h2>No Favorites Yet</h2>

          <p>
            You haven't added any favorite foods yet.
          </p>

          <Link
            to="/"
            className="browse-food-btn"
          >
            🍽️ Browse Food
          </Link>

        </div>
      ) : (

        /* Favorites */
        <div className="favorites-container">

          {favorites.map((food) => (

            <div
              className="favorite-card"
              key={food.id}
            >

              {/* Image */}
              <Link
                to={`/food/${food.id}`}
                className="favorite-image-link"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="favorite-image"
                />
              </Link>

              {/* Food Information */}
              <div className="favorite-info">

                <Link
                  to={`/food/${food.id}`}
                  className="favorite-name"
                >
                  {food.name}
                </Link>

                <p className="favorite-state">
                  📍 {food.state}
                </p>

                <p className="favorite-rating">
                  ⭐ {food.rating}
                </p>

                <div className="favorite-price">
                  ₹{food.price}
                </div>

              </div>

              {/* Actions */}
              <div className="favorite-actions">

                <button
                  className="favorite-cart-btn"
                  onClick={() => addToCart(food)}
                >
                  🛒 Add to Cart
                </button>

                <button
                  className="favorite-remove-btn"
                  onClick={() => removeFavorite(food.id)}
                >
                  ✕ Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default MyFavoritesPage;