import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { OrderContext } from "../contexts/OrderContext";
import { CouponContext } from "../contexts/CouponContext";
import "./CheckoutPage.css";

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const { addOrder } = useContext(OrderContext);

  const {
    appliedCoupon,
    removeCoupon,
  } = useContext(CouponContext);

  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
  });

  // Demo payment details
  const [upiId, setUpiId] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  // =========================
  // TOTALS
  // =========================

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const deliveryFee =
    cart.length === 0
      ? 0
      : subtotal >= 500
      ? 0
      : 40;

  const taxes = Math.round(subtotal * 0.05);

  const couponEligible =
    appliedCoupon &&
    subtotal >= appliedCoupon.minOrder;

  let discount = 0;

  if (couponEligible) {
    if (appliedCoupon.discountType === "percentage") {
      discount = Math.round(
        subtotal *
          (appliedCoupon.discountValue / 100)
      );
    } else {
      discount = Math.min(
        appliedCoupon.discountValue,
        subtotal
      );
    }
  }

  const grandTotal =
    subtotal +
    deliveryFee +
    taxes -
    discount;

  // =========================
  // ADDRESS
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // CARD
  // =========================

  const handleCardChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 16)
        .replace(/(.{4})/g, "$1 ")
        .trim();
    }

    if (name === "expiry") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 4);

      if (formattedValue.length >= 3) {
        formattedValue =
          formattedValue.slice(0, 2) +
          "/" +
          formattedValue.slice(2);
      }
    }

    if (name === "cvv") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 3);
    }

    setCardDetails((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =========================
  // VALIDATE ADDRESS
  // =========================

  const validateAddress = () => {
    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName =
        "Full name is required";
    }

    if (!address.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^\d{10}$/.test(
        address.phone.trim()
      )
    ) {
      newErrors.phone =
        "Enter a valid 10-digit phone number";
    }

    if (!address.addressLine.trim()) {
      newErrors.addressLine =
        "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city =
        "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state =
        "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required";
    } else if (
      !/^\d{6}$/.test(
        address.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    return newErrors;
  };

  // =========================
  // VALIDATE PAYMENT
  // =========================

  const validatePayment = () => {
    const newErrors = {};

    if (paymentMethod === "UPI") {
      if (!upiId.trim()) {
        newErrors.upiId =
          "UPI ID is required";
      } else if (
        !/^[\w.-]+@[\w.-]+$/.test(
          upiId.trim()
        )
      ) {
        newErrors.upiId =
          "Enter a valid UPI ID";
      }
    }

    if (paymentMethod === "Card") {
      const cleanCardNumber =
        cardDetails.cardNumber.replace(
          /\s/g,
          ""
        );

      if (
        !/^\d{16}$/.test(
          cleanCardNumber
        )
      ) {
        newErrors.cardNumber =
          "Enter a valid 16-digit card number";
      }

      if (
        !/^\d{2}\/\d{2}$/.test(
          cardDetails.expiry
        )
      ) {
        newErrors.expiry =
          "Use MM/YY format";
      }

      if (
        !/^\d{3}$/.test(
          cardDetails.cvv
        )
      ) {
        newErrors.cvv =
          "Enter a valid 3-digit CVV";
      }
    }

    return newErrors;
  };

  // =========================
  // PLACE ORDER
  // =========================

  const handlePlaceOrder = async () => {
    const addressErrors =
      validateAddress();

    const paymentErrors =
      validatePayment();

    const allErrors = {
      ...addressErrors,
      ...paymentErrors,
    };

    setErrors(allErrors);

    if (
      Object.keys(allErrors).length > 0
    ) {
      alert(
        "Please check your details before placing the order."
      );
      return;
    }

    const newOrder = await addOrder({
      items: cart,
      address,
      paymentMethod,
      subtotal,
      deliveryFee,
      taxes,
      discount,
      appliedCoupon: couponEligible
        ? appliedCoupon.code
        : null,
      grandTotal,
    });

    if (!newOrder) {
      alert("Failed to save order.");
      return;
    }

    // Clear cart and coupon
    clearCart();
    removeCoupon();

    // Go to confirmation
    navigate(
      `/order-confirmation/${newOrder.id}`
    );
  };

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <section className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some tasty food first!
          </p>

          <Link
            to="/"
            className="back-link"
          >
            ← Back to Menu
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page">

      {/* HEADER */}

      <div className="checkout-header">
        <h1>Checkout</h1>

        <p>
          Complete your order and get your
          favorite food delivered 🍽️
        </p>
      </div>

      {/* MAIN */}

      <div className="checkout-container">

        {/* =========================
            DELIVERY ADDRESS
        ========================= */}

        <div className="checkout-section address-section">

          <h3>
            📍 Delivery Address
          </h3>

          <div className="form-group">
            <label>
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              placeholder="e.g. Rahul Sharma"
              value={address.fullName}
              onChange={handleChange}
            />

            {errors.fullName && (
              <p className="field-error">
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              placeholder="e.g. 9876543210"
              value={address.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <p className="field-error">
                {errors.phone}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              Address
            </label>

            <input
              type="text"
              name="addressLine"
              placeholder="House no, Street, Area"
              value={address.addressLine}
              onChange={handleChange}
            />

            {errors.addressLine && (
              <p className="field-error">
                {errors.addressLine}
              </p>
            )}
          </div>

          <div className="form-row">

            <div className="form-group">
              <label>City</label>

              <input
                type="text"
                name="city"
                placeholder="e.g. Chennai"
                value={address.city}
                onChange={handleChange}
              />

              {errors.city && (
                <p className="field-error">
                  {errors.city}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>State</label>

              <input
                type="text"
                name="state"
                placeholder="e.g. Tamil Nadu"
                value={address.state}
                onChange={handleChange}
              />

              {errors.state && (
                <p className="field-error">
                  {errors.state}
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Pincode</label>

              <input
                type="text"
                name="pincode"
                placeholder="e.g. 600020"
                value={address.pincode}
                onChange={handleChange}
              />

              {errors.pincode && (
                <p className="field-error">
                  {errors.pincode}
                </p>
              )}
            </div>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="checkout-right">

          {/* ORDER SUMMARY */}

          <div className="checkout-section">

            <h3>
              🧾 Order Summary
            </h3>

            <div className="checkout-items">

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <span>
                    {item.name} ×{" "}
                    {item.quantity}
                  </span>

                  <span>
                    ₹
                    {item.price *
                      item.quantity}
                  </span>
                </div>
              ))}

            </div>

            <hr />

            <div className="checkout-item">
              <span>
                Item Total
              </span>

              <span>
                ₹{subtotal}
              </span>
            </div>

            <div className="checkout-item">
              <span>
                Delivery Fee
              </span>

              <span>
                {deliveryFee === 0
                  ? "FREE"
                  : `₹${deliveryFee}`}
              </span>
            </div>

            <div className="checkout-item">
              <span>
                Taxes & GST (5%)
              </span>

              <span>
                ₹{taxes}
              </span>
            </div>

            {appliedCoupon &&
              couponEligible && (
                <div className="checkout-item coupon-row">
                  <span>
                    🎟️{" "}
                    {appliedCoupon.code}
                  </span>

                  <span>
                    -₹{discount}
                  </span>
                </div>
              )}

            <hr />

            <div className="checkout-item checkout-grand-total">
              <span>
                To Pay
              </span>

              <span>
                ₹{grandTotal}
              </span>
            </div>

          </div>

          {/* =========================
              PAYMENT
          ========================= */}

          <div className="checkout-section">

            <h3>
              💳 Payment Method
            </h3>

            {/* COD */}

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={
                  paymentMethod === "COD"
                }
                onChange={(e) => {
                  setPaymentMethod(
                    e.target.value
                  );

                  setErrors({});
                }}
              />

              <span>
                💵 Cash on Delivery
              </span>
            </label>

            {/* UPI */}

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={
                  paymentMethod === "UPI"
                }
                onChange={(e) => {
                  setPaymentMethod(
                    e.target.value
                  );

                  setErrors({});
                }}
              />

              <span>
                📱 UPI
              </span>
            </label>

            {paymentMethod === "UPI" && (
              <div className="payment-details">

                <label>
                  UPI ID
                </label>

                <input
                  type="text"
                  placeholder="example@upi"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(
                      e.target.value
                    );

                    setErrors((prev) => ({
                      ...prev,
                      upiId: "",
                    }));
                  }}
                />

                {errors.upiId && (
                  <p className="field-error">
                    {errors.upiId}
                  </p>
                )}

                <small>
                  Demo payment only — no
                  real money will be charged.
                </small>

              </div>
            )}

            {/* CARD */}

            <label className="payment-option">
              <input
                type="radio"
                name="payment"
                value="Card"
                checked={
                  paymentMethod === "Card"
                }
                onChange={(e) => {
                  setPaymentMethod(
                    e.target.value
                  );

                  setErrors({});
                }}
              />

              <span>
                💳 Credit / Debit Card
              </span>
            </label>

            {paymentMethod === "Card" && (
              <div className="payment-details">

                <label>
                  Card Number
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  value={
                    cardDetails.cardNumber
                  }
                  onChange={
                    handleCardChange
                  }
                  name="cardNumber"
                />

                {errors.cardNumber && (
                  <p className="field-error">
                    {errors.cardNumber}
                  </p>
                )}

                <div className="card-row">

                  <div>
                    <label>
                      Expiry
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={
                        cardDetails.expiry
                      }
                      onChange={
                        handleCardChange
                      }
                      name="expiry"
                    />

                    {errors.expiry && (
                      <p className="field-error">
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <label>
                      CVV
                    </label>

                    <input
                      type="password"
                      inputMode="numeric"
                      placeholder="123"
                      value={
                        cardDetails.cvv
                      }
                      onChange={
                        handleCardChange
                      }
                      name="cvv"
                    />

                    {errors.cvv && (
                      <p className="field-error">
                        {errors.cvv}
                      </p>
                    )}
                  </div>

                </div>

                <small>
                  Demo payment only — card
                  details are not saved.
                </small>

              </div>
            )}

            {/* PLACE ORDER */}

            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
            >
              Place Order — ₹
              {grandTotal}
            </button>

            <Link
              to="/cart"
              className="back-link"
            >
              ← Back to Cart
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CheckoutPage;