import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../contexts/CartContext";
import { FavoriteContext } from "../contexts/FavoriteContext";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import "./Menu.css";
import foodData from "../data/foodData";
import Toast from "../components/Toast";

function Menu() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [toast, setToast] = useState(null);

  const [foods, setFoods] = useState(foodData);
  const [loadingFoods, setLoadingFoods] = useState(true);

  const { addToCart } = useContext(CartContext);

  const {
    favorites,
    addFavorite,
    removeFavorite,
  } = useContext(FavoriteContext);

  // =========================
  // LOAD AVAILABILITY FROM FIRESTORE
  // =========================

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "foods")
        );

        const firestoreFoods =
          snapshot.docs.map((foodDoc) => ({
            firestoreId: foodDoc.id,
            ...foodDoc.data(),
          }));

        const mergedFoods = foodData.map(
          (localFood) => {
            const matches =
              firestoreFoods.filter(
                (firestoreFood) =>
                  firestoreFood.name ===
                  localFood.name
              );

            // If duplicate documents exist,
            // use unavailable if ANY matching
            // document is unavailable.
            const unavailableFood =
              matches.find(
                (item) =>
                  item.available === false
              );

            const firestoreFood =
              unavailableFood || matches[0];

            return {
              ...localFood,
              ...(firestoreFood || {}),
              id: localFood.id,
            };
          }
        );

        setFoods(mergedFoods);

      } catch (error) {
        console.error(
          "Error loading food availability:",
          error
        );
      } finally {
        setLoadingFoods(false);
      }
    };

    loadFoods();
  }, []);

  // =========================
  // FILTER + SEARCH + SORT
  // =========================

  const filteredFood = foods
    .filter((food) => {

      const categoryMatch =
        category === "All" ||
        food.category === category;

      const searchMatch =
        food.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        categoryMatch &&
        searchMatch
      );
    })
    .sort((a, b) => {

      if (sort === "price-low") {
        return a.price - b.price;
      }

      if (sort === "price-high") {
        return b.price - a.price;
      }

      if (sort === "rating") {
        return b.rating - a.rating;
      }

      return 0;
    });

  // =========================
  // LOADING
  // =========================

  if (loadingFoods) {
    return (
      <section
        id="menu"
        className="menu-section"
      >
        <h2 className="menu-title">
          🍽️ Foodie Hub Menu
        </h2>

        <div className="no-food">
          🍽️ Loading menu...
        </div>
      </section>
    );
  }

  return (
    <section
      id="menu"
      className="menu-section"
    >

      {/* Menu Title */}

      <h2 className="menu-title">
        🍽️ Foodie Hub Menu
      </h2>

      {/* Search */}

      <input
        type="text"
        placeholder="🔍 Search your favorite food..."
        className="search-box"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      {/* Sort */}

      <select
        className="sort-select"
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
      >
        <option value="default">
          ↕️ Sort By
        </option>

        <option value="price-low">
          💰 Price: Low to High
        </option>

        <option value="price-high">
          💰 Price: High to Low
        </option>

        <option value="rating">
          ⭐ Highest Rated
        </option>
      </select>

      {/* Clear Filters */}

      <button
        className="clear-filters-btn"
        onClick={() => {
          setSearch("");
          setCategory("All");
          setSort("default");
        }}
      >
        ✕ Clear Filters
      </button>

      {/* Categories */}

      <div className="categories">

        <button
          onClick={() =>
            setCategory("All")
          }
          className={
            category === "All"
              ? "active"
              : ""
          }
        >
          All
        </button>

        <button
          onClick={() =>
            setCategory("South Indian")
          }
          className={
            category === "South Indian"
              ? "active"
              : ""
          }
        >
          South Indian
        </button>

        <button
          onClick={() =>
            setCategory("North Indian")
          }
          className={
            category === "North Indian"
              ? "active"
              : ""
          }
        >
          North Indian
        </button>

        <button
          onClick={() =>
            setCategory("Street Food")
          }
          className={
            category === "Street Food"
              ? "active"
              : ""
          }
        >
          Street Food
        </button>

        <button
          onClick={() =>
            setCategory("Dessert")
          }
          className={
            category === "Dessert"
              ? "active"
              : ""
          }
        >
          Desserts
        </button>

        <button
          onClick={() =>
            setCategory("Drinks")
          }
          className={
            category === "Drinks"
              ? "active"
              : ""
          }
        >
          Drinks
        </button>

      </div>

      {/* Food Cards */}

      <div className="menu-container">

        {filteredFood.length > 0 ? (

          filteredFood.map((food) => {

            const favorite =
              favorites.find(
                (item) =>
                  item.foodId ===
                  food.id
              );

            const unavailable =
              food.available === false;

            return (
              <div
                className={`food-card ${
                  unavailable
                    ? "food-card-unavailable"
                    : ""
                }`}
                key={food.id}
              >

                {/* Food Image */}

                <div className="food-image">

                  <Link
                    to={`/food/${food.id}`}
                  >
                    <img
                      src={food.image}
                      alt={food.name}
                    />
                  </Link>

                  {/* Favorite */}

                  <button
                    className={`favorite-btn ${
                      favorite
                        ? "favorite-active"
                        : ""
                    }`}
                    onClick={() => {

                      if (favorite) {

                        removeFavorite(
                          favorite.id
                        );

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
                      }, 2500);

                    }}
                  >
                    {favorite
                      ? "❤️"
                      : "🤍"}
                  </button>

                  {/* Rating */}

                  <div className="rating-badge">
                    ⭐ {food.rating}
                  </div>

                </div>

                {/* Food Information */}

                <div className="food-info">

                  <h3>
                    {food.name}
                  </h3>

                  <p className="food-state">
                    📍 {food.state}
                  </p>

                  <p className="food-category">
                    🍴 {food.category}
                  </p>

                  {/* Availability */}

                  {unavailable ? (

                    <p className="menu-unavailable">
                      🔴 Unavailable
                    </p>

                  ) : (

                    <p className="menu-available">
                      🟢 Available
                    </p>

                  )}

                  {/* Price + Cart */}

                  <div className="food-footer">

                    <span className="price">
                      ₹{food.price}
                    </span>

                    <button
                      className="cart-btn"
                      disabled={unavailable}
                      onClick={() => {

                        if (unavailable) {
                          return;
                        }

                        addToCart(food);

                        setToast({
                          message: `${food.name} added to cart!`,
                          type: "success",
                        });

                        setTimeout(() => {
                          setToast(null);
                        }, 2500);

                      }}
                    >
                      {unavailable
                        ? "🔴 Unavailable"
                        : "Add +"}
                    </button>

                  </div>

                </div>

              </div>
            );
          })

        ) : (

          <div className="no-food">
            😔 No food found
          </div>

        )}

      </div>

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

export default Menu; 