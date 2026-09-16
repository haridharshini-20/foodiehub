import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
    try {
      const savedCart =
        localStorage.getItem("foodiehub_cart");

      return savedCart
        ? JSON.parse(savedCart)
        : [];

    } catch {
      return [];
    }
  });


  // =========================
  // SAVE CART TO LOCAL STORAGE
  // =========================

  useEffect(() => {

    localStorage.setItem(
      "foodiehub_cart",
      JSON.stringify(cart)
    );

  }, [cart]);


  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (food) => {

    // Stop unavailable food
    if (food.available === false) {

      alert(
        `${food.name} is currently unavailable.`
      );

      return;
    }


    const existingItem = cart.find(
      (item) => item.id === food.id
    );


    if (existingItem) {

      setCart(
        cart.map((item) =>
          item.id === food.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...food,
          quantity: 1,
        },
      ]);

    }

  };


  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQty = (id) => {

    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );

  };


  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQty = (id) => {

    setCart(
      cart.map((item) =>
        item.id === id &&
        item.quantity > 1
          ? {
              ...item,
              quantity:
                item.quantity - 1,
            }
          : item
      )
    );

  };


  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (id) => {

    setCart(
      cart.filter(
        (item) => item.id !== id
      )
    );

  };


  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {

    setCart([]);

  };


  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >

      {children}

    </CartContext.Provider>

  );
}

export default CartProvider;