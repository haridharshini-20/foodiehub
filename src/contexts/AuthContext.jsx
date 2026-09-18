import { createContext, useState, useEffect } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isKitchen, setIsKitchen] = useState(false);

  const [role, setRole] = useState("user");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          console.log("No user logged in");

          setCurrentUser(null);
          setIsAdmin(false);
          setIsKitchen(false);
          setRole("user");
          setLoading(false);

          return;
        }

        console.log("Firebase UID:", user.uid);
        console.log("Firebase Email:", user.email);

        setCurrentUser(user);

        // Get Firestore user document
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        console.log(
          "Firestore document exists:",
          userSnap.exists()
        );

        if (userSnap.exists()) {
          const userData = userSnap.data();

          console.log("Firestore user data:", userData);
          console.log("User role:", userData.role);

          const userRole = userData.role || "user";

          setRole(userRole);

          if (userRole === "admin") {
            console.log("✅ ADMIN DETECTED");

            setIsAdmin(true);
            setIsKitchen(false);
          } else if (userRole === "kitchen") {
            console.log("✅ KITCHEN STAFF DETECTED");

            setIsAdmin(false);
            setIsKitchen(true);
          } else {
            console.log("❌ Normal user");

            setIsAdmin(false);
            setIsKitchen(false);
          }
        } else {
          console.log("❌ User document does not exist");

          // Create profile if missing
          await setDoc(userRef, {
            name: user.displayName || "",
            email: user.email || "",
            role: "user",
            createdAt: new Date().toISOString(),
          });

          setRole("user");
          setIsAdmin(false);
          setIsKitchen(false);
        }
      } catch (error) {
        console.error("Role checking error:", error);

        setRole("user");
        setIsAdmin(false);
        setIsKitchen(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // ================================
  // SIGNUP
  // ================================

  const signup = async (name, email, password) => {
    const userCredential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: name,
    });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
    });

    setCurrentUser({
      ...user,
      displayName: name,
    });

    setRole("user");
    setIsAdmin(false);
    setIsKitchen(false);
  };

  // ================================
  // LOGIN
  // ================================

  const login = (email, password) => {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  // ================================
  // LOGOUT
  // ================================

  const logout = async () => {
    setIsAdmin(false);
    setIsKitchen(false);
    setRole("user");

    await signOut(auth);
  };

  // ================================
  // PASSWORD RESET
  // ================================

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // ================================
  // CHANGE PASSWORD
  // ================================

  const changePassword = (newPassword) => {
    return updatePassword(
      auth.currentUser,
      newPassword
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isKitchen,
        role,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        changePassword,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;