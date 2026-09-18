import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function KitchenRoute({ children }) {
  const {
    currentUser,
    isAdmin,
    isKitchen,
    loading,
  } = useContext(AuthContext);

  // Wait for Firebase authentication and role check
  if (loading) {
    return <p>Checking kitchen permissions...</p>;
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Admins and kitchen staff can access the Kitchen Dashboard
  if (!isAdmin && !isKitchen) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default KitchenRoute;