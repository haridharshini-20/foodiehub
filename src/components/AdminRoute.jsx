import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function AdminRoute({ children }) {
  const { currentUser, isAdmin, loading } =
    useContext(AuthContext);

  // Wait for Firebase authentication
  if (loading) {
    return <p>Checking permissions...</p>;
  }

  // Not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin
  return children;
}

export default AdminRoute;