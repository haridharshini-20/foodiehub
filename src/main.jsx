import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

import AuthProvider from "./contexts/AuthContext";
import CartProvider from "./contexts/CartContext";
import OrderProvider from "./contexts/OrderContext";
import FavoriteProvider from "./contexts/FavoriteContext";
import CouponProvider from "./contexts/CouponContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
  <CartProvider>
    <FavoriteProvider>
      <OrderProvider>
        <CouponProvider>
          <App />
        </CouponProvider>
      </OrderProvider>
    </FavoriteProvider>
  </CartProvider>
</AuthProvider>
    </BrowserRouter>
  </StrictMode>
);