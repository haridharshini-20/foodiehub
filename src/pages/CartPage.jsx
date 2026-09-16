import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";
import { AuthContext } from "../contexts/AuthContext";
import { CouponContext } from "../contexts/CouponContext";
import "./CartPage.css";

function CartPage() {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);
  const {
  appliedCoupon,
  removeCoupon,
} = useContext(CouponContext);
  const navigate = useNavigate();

  // Subtotal
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Free delivery above ₹500, otherwise ₹40
  const deliveryFee =
    cart.length === 0
      ? 0
      : subtotal >= 500
      ? 0
      : 40;

  // 5% GST
  const taxes = Math.round(subtotal * 0.05);

 const couponEligible =
  appliedCoupon &&
  subtotal >= appliedCoupon.minOrder;

let discount = 0;

if (couponEligible) {
  if (appliedCoupon.discountType === "percentage") {
    discount = Math.round(
      subtotal * (appliedCoupon.discountValue / 100)
    );
  } else {
    discount = Math.min(
      appliedCoupon.discountValue,
      subtotal
    );
  }
}

const grandTotal =
  subtotal + deliveryFee + taxes - discount;

  const amountLeftForFreeDelivery = 500 - subtotal;

  const handleCheckout = () => {
    if (!currentUser) {
      alert("Please login or create an account to place an order.");

      navigate("/login", {
        state: { from: "/checkout" },
      });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <section className="cart-page">

      {/* Page Title */}

      <h1 className="cart-title">
        🛒 Your Cart
      </h1>

      {/* Empty Cart */}

      {cart.length === 0 ? (

        <div className="empty-cart">

          <p>
            Your cart is empty.
          </p>

          <Link
            to="/"
            className="back-link"
          >
            ← Back to Menu
          </Link>

        </div>

      ) : (

        <>

          {/* Cart Content */}

          <div className="cart-content">

            {/* Left Side */}

            <div>

              <div className="cart-items">

                {cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="cart-item-details">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        ₹{item.price} each
                      </p>

                      <div className="qty-controls">

                        <button
                          className="qty-btn"
                          onClick={() =>
                            decreaseQty(item.id)
                          }
                        >
                          −
                        </button>

                        <span className="qty-value">
                          {item.quantity}
                        </span>

                        <button
                          className="qty-btn"
                          onClick={() =>
                            increaseQty(item.id)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <div className="cart-item-right">

                      <div className="cart-item-price">
                        ₹{item.price * item.quantity}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                      >
                        🗑️ Remove
                      </button>

                    </div>

                  </div>

                ))}

              </div>

              {/* Free Delivery Message */}

              {amountLeftForFreeDelivery > 0 && (

                <p className="free-delivery-hint">

                  Add items worth ₹
                  {amountLeftForFreeDelivery}
                  {" "}
                  more for FREE delivery! 🚀

                </p>

              )}

            </div>

            {/* Bill Summary */}

            <div className="bill-summary">

              <h3 className="bill-title">
                Bill Details
              </h3>

              <div className="bill-row">

                <span>
                  Item Total
                </span>

                <span>
                  ₹{subtotal}
                </span>

              </div>

              <div className="bill-row">

                <span>
                  Delivery Fee
                </span>

                <span>
                  {deliveryFee === 0
                    ? "FREE"
                    : `₹${deliveryFee}`}
                </span>

              </div>

              <div className="bill-row">

                <span>
                  Taxes & GST (5%)
                </span>

                <span>
                  ₹{taxes}
                </span>

              </div>
              {appliedCoupon && couponEligible && (
  <>
    <div className="bill-row coupon-row">
      <span>🎟️ {appliedCoupon.code}</span>
      <span>-₹{discount}</span>
    </div>

    <button
      className="remove-coupon-btn"
      onClick={removeCoupon}
    >
      ✕ Remove Coupon
    </button>
  </>
)}
{appliedCoupon && !couponEligible && (
  <p className="coupon-message">
    ⚠️ Add ₹{appliedCoupon.minOrder - subtotal} more
    to use {appliedCoupon.code}.
  </p>
)}

              <hr />

              <div className="bill-row bill-grand-total">

                <span>
                  To Pay
                </span>

                <span>
                  ₹{grandTotal}
                </span>

              </div>

            </div>

          </div>

          {/* Bottom Actions */}

          <div className="cart-actions">

            <Link
              to="/"
              className="back-link"
            >
              ← Continue Shopping
            </Link>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout →
            </button>

          </div>

        </>

      )}

    </section>
  );
}

export default CartPage;