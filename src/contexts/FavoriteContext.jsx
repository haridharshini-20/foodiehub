import { createContext, useState, useEffect, useContext } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "./AuthContext";

export const FavoriteContext = createContext();

function FavoriteProvider({ children }) {
  const { currentUser } = useContext(AuthContext);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUser) {
        setFavorites([]);
        return;
      }

      try {
        const q = query(
          collection(db, "favorites"),
          where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setFavorites(data);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavorites();
  }, [currentUser]);

  // Add favorite
  const addFavorite = async (food) => {
    if (!currentUser) return;

    try {
      const favorite = {
        userId: currentUser.uid,
        foodId: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        category: food.category,
        rating: food.rating,
        state: food.state,
      };

      const docRef = await addDoc(
        collection(db, "favorites"),
        favorite
      );

      setFavorites((prev) => [
        ...prev,
        {
          id: docRef.id,
          ...favorite,
        },
      ]);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  // Remove favorite
  const removeFavorite = async (favoriteId) => {
    try {
      await deleteDoc(doc(db, "favorites", favoriteId));

      setFavorites((prev) =>
        prev.filter((item) => item.id !== favoriteId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export default FavoriteProvider;