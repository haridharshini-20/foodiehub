import { useParams, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";

import foodData from "../data/foodData";

import { CartContext } from "../contexts/CartContext";
import { FavoriteContext } from "../contexts/FavoriteContext";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import "./FoodDetailsPage.css";
import Toast from "../components/Toast";

function FoodDetailsPage() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [allFoods, setAllFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useContext(CartContext);

  const {
    favorites,
    addFavorite,
    removeFavorite,
  } = useContext(FavoriteContext);

  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState(null);

  // =========================
  // LOAD FOOD
  // =========================

  useEffect(() => {
    const loadFood = async () => {
      setLoading(true);

      // Find food from local foodData
      const originalFood = foodData.find(
        (item) => item.id === Number(id)
      );

      // Food not found
      if (!originalFood) {
        setFood(null);
        setLoading(false);
        return;
      }

      // Show local data immediately
      setFood({
        ...originalFood,
        available: true,
      });

      try {
        // Get Firestore data
        const snapshot = await getDocs(
          collection(db, "foods")
        );

        const firestoreFoods = snapshot.docs.map(
          (foodDoc) => ({
            firestoreId: foodDoc.id,
            ...foodDoc.data(),
          })
        );

        setAllFoods(firestoreFoods);

        // Find matching Firestore food
        const firestoreFood = firestoreFoods.find(
          (item) => item.name === originalFood.name
        );

        // Merge Firestore data
        // but ALWAYS keep local image path
        if (firestoreFood) {
          setFood({
            ...originalFood,
            ...firestoreFood,

            // Keep local numeric ID
            id: originalFood.id,

            // Keep Firebase document ID
            firestoreId: firestoreFood.firestoreId,

            // IMPORTANT:
            // Always use image from public folder
            image: originalFood.image,
          });
        }
      } catch (error) {
        console.warn(
          "Firestore unavailable. Using local food data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadFood();
  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="food-details-page">
        <div className="food-not-found">
          <h2>🍽️ Loading Food...</h2>
        </div>
      </section>
    );
  }

  // =========================
  // FOOD NOT FOUND
  // =========================

  if (!food) {
    return (
      <div className="food-not-found">
        <h2>😔 Food Not Found</h2>

        <Link
          to="/"
          className="back-btn"
        >
          ← Back to Menu
        </Link>
      </div>
    );
  }

  // =========================
  // RELATED FOODS
  // =========================

  const relatedFoods = foodData
    .filter(
      (item) =>
        item.category === food.category &&
        item.id !== food.id
    )
    .slice(0, 3)
    .map((item) => {
      const firestoreFood = allFoods.find(
        (firestoreItem) =>
          firestoreItem.name === item.name
      );

      return {
        ...(firestoreFood || {}),
        ...item,

        // Keep local ID
        id: item.id,

        // IMPORTANT:
        // Always keep local/public image
        image: item.image,
      };
    });

  // =========================
  // FAVORITE
  // =========================

  const favorite = favorites.find(
    (item) => item.foodId === food.id
  );

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice =
    food.price * quantity;

  // =========================
  // ADD TO CART
  // =========================

  const handleAddToCart = () => {
    if (food.available === false) {
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(food);
    }

    setToast({
      message:
        quantity > 1
          ? `${food.name} × ${quantity} added to cart!`
          : `${food.name} added to cart!`,
      type: "success",
    });

    setTimeout(() => {
      setToast(null);
    }, 1200);
  };

  // =========================
  // FAVORITE
  // =========================

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(favorite.id);

      setToast({
        message: `${food.name} removed from favorites`,
        type: "favorite",
      });
    } else {
      addFavorite(food);

      setToast({
        message: `${food.name} added to favorites!`,
        type: "favorite",
      });
    }

    setTimeout(() => {
      setToast(null);
    }, 1200);
  };

  // =========================
  // PAGE
  // =========================

  return (
    <section className="food-details-page">

      {/* Back Button */}

      <Link
        to="/"
        className="back-btn"
      >
        ← Back to Menu
      </Link>

      {/* Main Details */}

      <div className="details-container">

        {/* Image */}

        <div className="details-image">

          <img
            src={food.image}
            alt={food.name}
          />

          <div className="details-rating">
            ⭐ {food.rating}
          </div>

        </div>

        {/* Information */}

        <div className="details-info">

          <span className="details-category">
            🍴 {food.category}
          </span>

          <h1>
            {food.name}
          </h1>

          <p className="details-state">
            📍 From {food.state}
          </p>

          <div className="price-box">
            ₹{food.price}
          </div>

          <p className="details-description">
            {food.description}
          </p>

          {/* Ingredients */}

          <div className="ingredients-section">

            <h3>
              🥘 Ingredients
            </h3>

            <ul>
              {(food.ingredients || []).map(
                (item, index) => (
                  <li key={index}>
                    ✔ {item}
                  </li>
                )
              )}
            </ul>

          </div>

          {/* Availability */}

          <div className="food-availability">

            {food.available === false ? (
              <p className="food-unavailable">
                🔴 This food is currently unavailable
              </p>
            ) : (
              <p className="food-available">
                🟢 Available
              </p>
            )}

          </div>

          {/* Quantity */}

          <div className="quantity-section">

            <span>
              Quantity
            </span>

            <div className="quantity-box">

              <button
                onClick={() =>
                  quantity > 1 &&
                  setQuantity(quantity - 1)
                }
                disabled={
                  food.available === false
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
                disabled={
                  food.available === false
                }
              >
                +
              </button>

            </div>

          </div>

          {/* Total */}

          <div className="total-price">
            Total:

            <strong>
              ₹{totalPrice}
            </strong>
          </div>

          {/* Buttons */}

          <div className="details-buttons">

            <button
              className="details-cart-btn"
              onClick={handleAddToCart}
              disabled={
                food.available === false
              }
            >
              {food.available === false
                ? "🔴 Unavailable"
                : "🛒 Add to Cart"}
            </button>

            <button
              className={`favorite-detail-btn ${
                favorite
                  ? "favorite-detail-active"
                  : ""
              }`}
              onClick={handleFavorite}
            >
              {favorite
                ? "❤️ Remove Favorite"
                : "🤍 Add Favorite"}
            </button>

          </div>

        </div>

      </div>

      {/* Related Foods */}

      {relatedFoods.length > 0 && (
        <div className="related-section">

          <h2>
            You May Also Like 🍽️
          </h2>

          <div className="related-container">

            {relatedFoods.map((item) => (

              <Link
                key={item.id}
                to={`/food/${item.id}`}
                className="related-card"
              >

                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="related-info">

                  <h4>
                    {item.name}
                  </h4>

                  <p>
                    ⭐ {item.rating}
                  </p>

                  <strong>
                    ₹{item.price}
                  </strong>

                </div>

              </Link>

            ))}

          </div>

        </div>
      )}

      {/* Toast */}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}

    </section>
  );
}

export default FoodDetailsPage;