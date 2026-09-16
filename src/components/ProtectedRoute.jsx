import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  // User is not logged in
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // User is logged in
  return children;
}

export default ProtectedRoute;