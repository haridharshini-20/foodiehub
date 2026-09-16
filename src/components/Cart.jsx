import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

function Cart() {
  const { cart } = useContext(CartContext);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff8f0",
        margin: "20px",
        borderRadius: "10px",
      }}
    >
      <h2>🛒 Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px 0",
              }}
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />
          <h3>Total: ₹{total}</h3>
        </>
      )}
    </div>
  );
}

export default Cart;