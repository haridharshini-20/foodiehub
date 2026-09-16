import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import foodData from "../data/foodData";

export const seedFoods = async () => {
  try {
    const foodsRef = collection(db, "foods");

    const snapshot = await getDocs(foodsRef);

    console.log("Existing foods:", snapshot.size);

    // =====================================
    // REMOVE DUPLICATE FOODS
    // =====================================

    const seenFoods = new Set();

    for (const foodDoc of snapshot.docs) {
      const food = foodDoc.data();

      if (seenFoods.has(food.name)) {
        await deleteDoc(foodDoc.ref);

        console.log(`Deleted duplicate: ${food.name}`);
      } else {
        seenFoods.add(food.name);
      }
    }

    // =====================================
    // GET FOODS AGAIN AFTER CLEANUP
    // =====================================

    const updatedSnapshot = await getDocs(foodsRef);

    // =====================================
    // UPDATE / ADD FOOD DATA
    // =====================================

    for (const food of foodData) {
      const existingDoc = updatedSnapshot.docs.find(
        (doc) => doc.data().name === food.name
      );

      if (existingDoc) {
        await updateDoc(existingDoc.ref, {
          name: food.name,
          state: food.state,
          category: food.category,
          price: food.price,
          rating: food.rating,
          image: food.image,
          description: food.description,
          ingredients: food.ingredients,
          available: true,
        });

        console.log(`Updated: ${food.name}`);
      } else {
        await addDoc(foodsRef, {
          name: food.name,
          state: food.state,
          category: food.category,
          price: food.price,
          rating: food.rating,
          image: food.image,
          description: food.description,
          ingredients: food.ingredients,
          available: true,
        });

        console.log(`Added: ${food.name}`);
      }
    }

    console.log("Food cleanup and update completed!");
  } catch (error) {
    console.error("Food cleanup failed:", error);
  }
};