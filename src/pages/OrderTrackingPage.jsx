import { Fragment, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";
import { ORDER_STATUSES } from "../contexts/OrderContext";
import "./OrderTrackingPage.css";

const STATUS_ICONS = {
  "Order Placed": "🧾",
  Preparing: "👨‍🍳",
  "Out for Delivery": "🛵",
  Delivered: "🎉",
};

function OrderTrackingPage() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================================
  // REAL-TIME ORDER LISTENER
  // ================================

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = doc(db, "orders", orderId);

    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setOrder({
            id: snapshot.id,
            ...snapshot.data(),
          });
        } else {
          setOrder(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error listening to order:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [orderId]);

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="tracking-page">
        <div className="tracking-not-found">
          <div className="not-found-icon">📦</div>

          <h2>Loading Order...</h2>

          <p>
            Getting the latest order status.
          </p>
        </div>
      </section>
    );
  }

  // ================================
  // ORDER NOT FOUND
  // ================================

  if (!order) {
    return (
      <section className="tracking-page">
        <div className="tracking-not-found">
          <div className="not-found-icon">📦</div>

          <h2>Order Not Found</h2>

          <p>
            We couldn't find this order. Please go back
            to your orders and try again.
          </p>

          <Link
            to="/my-orders"
            className="tracking-btn"
          >
            ← Back to My Orders
          </Link>
        </div>
      </section>
    );
  }

  // ================================
  // STATUS
  // ================================

  const currentStatus = order.status || "Order Placed";

  const currentIndex =
    ORDER_STATUSES.indexOf(currentStatus);

  const isDelivered =
    currentStatus === "Delivered";

  const isCancelled =
    currentStatus === "Cancelled";

  return (
    <section className="tracking-page">
      <div className="tracking-container">

        {/* ================= HEADER ================= */}

        <div className="tracking-header">

          <div className="tracking-header-icon">
            🛵
          </div>

          <div>
            <h1>Track Your Order</h1>

            <p>
              Order ID:
              <strong>
                #{order.id.slice(0, 10)}
              </strong>
            </p>
          </div>

        </div>


        {/* ================= STATUS ================= */}

        <div className="tracking-card status-card">

          <div className="card-heading">

            <div>
              <h2>Order Status</h2>

              <p>
                Follow your food as it makes its way to you
              </p>
            </div>

            <span className="status-badge">
              {currentStatus}
            </span>

          </div>


          {/* TIMELINE */}

          {!isCancelled && (
            <div className="status-timeline">

              {ORDER_STATUSES.map(
                (status, index) => {

                  const isCompleted =
                    index < currentIndex;

                  const isActive =
                    index === currentIndex;

                  return (
                    <Fragment key={status}>

                      <div className="step">

                        <div
                          className={
                            "step-circle" +
                            (isCompleted
                              ? " completed"
                              : "") +
                            (isActive
                              ? " active"
                              : "")
                          }
                        >
                          {isCompleted
                            ? "✓"
                            : STATUS_ICONS[status]}
                        </div>

                        <p
                          className={
                            "step-label" +
                            (isActive ||
                            isCompleted
                              ? " reached"
                              : "")
                          }
                        >
                          {status}
                        </p>

                      </div>


                      {index <
                        ORDER_STATUSES.length - 1 && (
                        <div
                          className={
                            "step-line" +
                            (index < currentIndex
                              ? " completed"
                              : "")
                          }
                        />
                      )}

                    </Fragment>
                  );
                }
              )}

            </div>
          )}


          {/* LIVE STATUS */}

          <p
            className={
              "live-status" +
              (isDelivered
                ? " delivered"
                : "") +
              (isCancelled
                ? " cancelled"
                : "")
            }
          >
            {isCancelled
              ? "❌ This order has been cancelled."
              : isDelivered
              ? "🎉 Your order has been delivered. Enjoy your meal!"
              : `Current status: ${currentStatus}`}
          </p>

        </div>


        {/* ================= DELIVERY ADDRESS ================= */}

        <div className="tracking-card">

          <div className="card-title">
            <span>📍</span>
            <h2>Delivery Address</h2>
          </div>

          <div className="delivery-address">

            <strong>
              {order.address?.fullName || "Customer"}
            </strong>

            <p>
              📞 {order.address?.phone || "-"}
            </p>

            <p>
              {order.address?.addressLine || "-"}
            </p>

            <p>
              {order.address?.city || "-"},{" "}
              {order.address?.state || "-"} -{" "}
              {order.address?.pincode || "-"}
            </p>

          </div>

        </div>


        {/* ================= ORDER ITEMS ================= */}

        <div className="tracking-card">

          <div className="card-title">
            <span>🍽️</span>
            <h2>Ordered Items</h2>
          </div>

          <div className="tracking-items">

            {Array.isArray(order.items) &&
            order.items.length > 0 ? (

              order.items.map((item, index) => (

                <div
                  className="tracking-row"
                  key={item.id || index}
                >

                  <div className="tracking-item-info">

                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || "Food item"}
                      />
                    )}

                    <div>

                      <h3>
                        {item.name || "Food Item"}
                      </h3>

                      <p>
                        Quantity: {item.quantity || 1}
                      </p>

                    </div>

                  </div>

                  <strong>
                    ₹
                    {Number(item.price || 0) *
                      Number(item.quantity || 1)}
                  </strong>

                </div>

              ))

            ) : (

              <p>No items available.</p>

            )}

          </div>

        </div>


        {/* ================= PAYMENT SUMMARY ================= */}

        <div className="tracking-card">

          <div className="card-title">
            <span>💰</span>
            <h2>Payment Summary</h2>
          </div>

          <div className="summary-row">
            <span>Item Total</span>
            <span>
              ₹{order.subtotal || 0}
            </span>
          </div>

          <div className="summary-row">

            <span>Delivery Fee</span>

            <span>
              {Number(order.deliveryFee || 0) === 0
                ? "FREE"
                : `₹${order.deliveryFee}`}
            </span>

          </div>

          <div className="summary-row">

            <span>Taxes & GST</span>

            <span>
              ₹{order.taxes || 0}
            </span>

          </div>

          <hr />

          <div className="summary-row grand-total">

            <span>To Pay</span>

            <span>
              ₹
              {order.grandTotal ||
                order.total ||
                0}
            </span>

          </div>

          <div className="payment-method">

            💳 Payment Method:

            <strong>
              {order.paymentMethod || "Not specified"}
            </strong>

          </div>

        </div>


        {/* ================= ACTIONS ================= */}

        <div className="tracking-actions">

          <Link
            to="/my-orders"
            className="back-link"
          >
            ← My Orders
          </Link>

          <Link
            to="/"
            className="tracking-btn"
          >
            🏠 Back to Home
          </Link>

        </div>

      </div>
    </section>
  );
}

export default OrderTrackingPage;