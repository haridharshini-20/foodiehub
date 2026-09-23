import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";
import foodData from "../data/foodData";
import "./AdminFoodsPage.css";

// =====================================================
// GET CORRECT IMAGE FOR FOOD
// =====================================================
const getFoodImage = (food) => {
  if (!food) return "";

  // Find matching food from local foodData.js
  const localFood = foodData.find(
    (item) =>
      item.name?.trim().toLowerCase() ===
      food.name?.trim().toLowerCase()
  );

  // Prefer the local image path
  if (localFood?.image) {
    return localFood.image;
  }

  // Otherwise use Firestore image
  if (food.image) {
    return food.image;
  }

  return "";
};

// =====================================================
// ADMIN FOODS PAGE
// =====================================================
function AdminFoodsPage() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const [newFood, setNewFood] = useState({
    name: "",
    category: "",
    state: "",
    price: "",
    rating: "",
    image: "",
    description: "",
  });

  // =====================================================
  // LOAD FOODS FROM FIRESTORE
  // =====================================================
  useEffect(() => {
    const loadFoods = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "foods")
        );

        const foodsData = snapshot.docs.map((foodDoc) => {
          const firestoreFood = foodDoc.data();

          return {
            id: foodDoc.id,
            ...firestoreFood,

            // IMPORTANT:
            // Use the correct image from foodData.js
            image: getFoodImage(firestoreFood),
          };
        });

        setFoods(foodsData);
      } catch (error) {
        console.error("Error loading foods:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFoods();
  }, []);

  // =====================================================
  // OPEN ADD FORM
  // =====================================================
  const handleOpenAddForm = () => {
    setEditingFood(null);

    setNewFood({
      name: "",
      category: "",
      state: "",
      price: "",
      rating: "",
      image: "",
      description: "",
    });

    setShowAddForm(true);
  };

  // =====================================================
  // ADD / UPDATE FOOD
  // =====================================================
  const handleAddFood = async () => {
    if (
      !newFood.name ||
      !newFood.category ||
      !newFood.state ||
      !newFood.price ||
      !newFood.rating
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const foodDataToSave = {
        name: newFood.name,
        category: newFood.category,
        state: newFood.state,
        price: Number(newFood.price),
        rating: Number(newFood.rating),
        image: newFood.image,
        description: newFood.description,
        ingredients: editingFood?.ingredients || [],
        available: editingFood?.available ?? true,
      };

      // =================================================
      // UPDATE EXISTING FOOD
      // =================================================
      if (editingFood) {
        await updateDoc(
          doc(db, "foods", editingFood.id),
          foodDataToSave
        );

        setFoods((previousFoods) =>
          previousFoods.map((food) =>
            food.id === editingFood.id
              ? {
                  ...food,
                  ...foodDataToSave,

                  // Keep correct local image
                  image: getFoodImage({
                    ...food,
                    ...foodDataToSave,
                  }),
                }
              : food
          )
        );

        alert("Food updated successfully!");
      }

      // =================================================
      // ADD NEW FOOD
      // =================================================
      else {
        const docRef = await addDoc(
          collection(db, "foods"),
          foodDataToSave
        );

        const addedFood = {
          id: docRef.id,
          ...foodDataToSave,
        };

        setFoods((previousFoods) => [
          ...previousFoods,
          {
            ...addedFood,
            image: getFoodImage(addedFood),
          },
        ]);

        alert("Food added successfully!");
      }

      // =================================================
      // RESET FORM
      // =================================================
      setNewFood({
        name: "",
        category: "",
        state: "",
        price: "",
        rating: "",
        image: "",
        description: "",
      });

      setEditingFood(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving food:", error);
      alert("Failed to save food.");
    }
  };

  // =====================================================
  // EDIT FOOD
  // =====================================================
  const handleEdit = (food) => {
    setEditingFood(food);

    setNewFood({
      name: food.name || "",
      category: food.category || "",
      state: food.state || "",
      price: food.price ?? "",
      rating: food.rating ?? "",

      // Use the actual displayed image
      image: getFoodImage(food),

      description: food.description || "",
    });

    setShowAddForm(true);

    setTimeout(() => {
      const form = document.querySelector(".add-food-form");

      if (form) {
        form.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // =====================================================
  // TOGGLE AVAILABILITY
  // =====================================================
  const handleToggleAvailability = async (food) => {
    const newAvailability = food.available === false;

    try {
      await updateDoc(
        doc(db, "foods", food.id),
        {
          available: newAvailability,
        }
      );

      setFoods((previousFoods) =>
        previousFoods.map((item) =>
          item.id === food.id
            ? {
                ...item,
                available: newAvailability,
              }
            : item
        )
      );

      alert(
        newAvailability
          ? "Food is now available!"
          : "Food is now unavailable!"
      );
    } catch (error) {
      console.error(
        "Error updating availability:",
        error
      );

      alert("Failed to update food availability.");
    }
  };

  // =====================================================
  // CANCEL FORM
  // =====================================================
  const handleCancel = () => {
    setShowAddForm(false);
    setEditingFood(null);

    setNewFood({
      name: "",
      category: "",
      state: "",
      price: "",
      rating: "",
      image: "",
      description: "",
    });
  };

  // =====================================================
  // DELETE FOOD
  // =====================================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, "foods", id)
      );

      setFoods((previousFoods) =>
        previousFoods.filter(
          (food) => food.id !== id
        )
      );

      alert("Food deleted successfully.");
    } catch (error) {
      console.error(
        "Error deleting food:",
        error
      );

      alert("Failed to delete food.");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================
  if (loading) {
    return (
      <section className="admin-foods-page">
        <div className="admin-loading">
          🍽️ Loading foods...
        </div>
      </section>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================
  return (
    <section className="admin-foods-page">

      {/* =================================================
          HEADER
      ================================================= */}
      <div className="admin-foods-header">
        <div>
          <h1>🍽️ Manage Foods</h1>

          <p>
            Add, edit and manage Foodie Hub
            menu items.
          </p>
        </div>

        <button
          className="add-food-btn"
          type="button"
          onClick={handleOpenAddForm}
        >
          + Add Food
        </button>
      </div>

      {/* =================================================
          COUNT
      ================================================= */}
      <div className="food-count">
        {foods.length} Food Items
      </div>

      {/* =================================================
          ADD / EDIT FORM
      ================================================= */}
      {showAddForm && (
        <div className="add-food-form">

          <h2>
            {editingFood
              ? "✏️ Edit Food"
              : "➕ Add New Food"}
          </h2>

          <input
            type="text"
            placeholder="Food name"
            value={newFood.name}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Category"
            value={newFood.category}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                category: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="State"
            value={newFood.state}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                state: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={newFood.price}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                price: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Rating"
            step="0.1"
            value={newFood.rating}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                rating: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={newFood.image}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                image: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Food description"
            value={newFood.description}
            onChange={(e) =>
              setNewFood({
                ...newFood,
                description: e.target.value,
              })
            }
          />

          <div className="add-food-form-actions">

            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddFood}
            >
              {editingFood
                ? "Update Food"
                : "Save Food"}
            </button>

          </div>
        </div>
      )}

      {/* =================================================
          EMPTY
      ================================================= */}
      {foods.length === 0 ? (

        <div className="admin-foods-empty">

          <div className="empty-food-icon">
            🍽️
          </div>

          <h2>
            No Food Items Found
          </h2>

          <p>
            Add food items to your menu.
          </p>

        </div>

      ) : (

        /* =================================================
           FOOD GRID
        ================================================= */
        <div className="admin-food-grid">

          {foods.map((food) => {

            // Get correct image
            const foodImage = getFoodImage(food);

            return (
              <div
                className="admin-food-card"
                key={food.id}
              >

                {/* =================================================
                    IMAGE
                ================================================= */}
                {foodImage ? (

                  <img
                    src={foodImage}
                    alt={food.name}
                    className="admin-food-image"

                    onError={(e) => {
                      console.error(
                        `Image failed to load: ${foodImage}`
                      );

                      // Hide broken image
                      e.currentTarget.style.display =
                        "none";

                      // Show placeholder
                      const parent =
                        e.currentTarget.parentElement;

                      if (parent) {
                        parent.classList.add(
                          "image-load-failed"
                        );
                      }
                    }}
                  />

                ) : (

                  <div className="admin-food-image-placeholder">
                    🍽️
                  </div>

                )}

                {/* =================================================
                    CONTENT
                ================================================= */}
                <div className="admin-food-content">

                  <div className="admin-food-title">

                    <h3>
                      {food.name}
                    </h3>

                    <span>
                      ⭐ {food.rating || 0}
                    </span>

                  </div>

                  <p className="food-category">
                    {food.category || "Food"}
                  </p>

                  <p className="food-state">
                    📍 {food.state || "India"}
                  </p>

                  <p
                    className={
                      food.available === false
                        ? "food-unavailable"
                        : "food-available"
                    }
                  >
                    {food.available === false
                      ? "🔴 Unavailable"
                      : "🟢 Available"}
                  </p>

                  <p className="food-description">
                    {food.description ||
                      "No description available."}
                  </p>

                  <div className="admin-food-bottom">

                    <strong>
                      ₹{food.price || 0}
                    </strong>

                    <div className="food-actions">

                      <button
                        className="edit-food-btn"
                        type="button"
                        onClick={() =>
                          handleEdit(food)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="availability-food-btn"
                        type="button"
                        onClick={() =>
                          handleToggleAvailability(food)
                        }
                      >
                        {food.available === false
                          ? "Make Available"
                          : "Make Unavailable"}
                      </button>

                      <button
                        className="delete-food-btn"
                        type="button"
                        onClick={() =>
                          handleDelete(food.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </section>
  );
}

export default AdminFoodsPage;