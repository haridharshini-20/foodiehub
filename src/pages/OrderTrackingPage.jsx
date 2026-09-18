
import { useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { OrderContext } from "../contexts/OrderContext";
import "./OrderTrackingPage.css";

const TRACKING_STEPS = [
  {
    status: "Order Placed",
    icon: "🧾",
    description: "Your order has been placed",
  },
  {
    status: "Preparing",
    icon: "👨‍🍳",
    description: "Your food is being prepared",
  },
  {
    status: "Out for Delivery",
    icon: "🛵",
    description: "Your order is on the way",
  },
  {
    status: "Delivered",
    icon: "🎉",
    description: "Your order has been delivered",
  },
];

function normalizeStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  const statusMap = {
    "order placed": "Order Placed",
    placed: "Order Placed",
    pending: "Order Placed",

    "sent to kitchen": "Preparing",
    preparing: "Preparing",

    ready: "Out for Delivery",
    "out for delivery": "Out for Delivery",

    completed: "Delivered",
    delivered: "Delivered",

    cancelled: "Cancelled",
    canceled: "Cancelled",
  };

  return statusMap[value] || "Order Placed";
}

function OrderTrackingPage() {
  const { orderId } = useParams();

  const { getOrderById } = useContext(OrderContext);

  const order = getOrderById(orderId);

  // =========================
  // ORDER NOT FOUND
  // =========================

  if (!order) {
    return (
      <main className="tracking-page">
        <div className="tracking-not-found">
          <div className="tracking-not-found-icon">
            📦
          </div>

          <h2>Order Not Found</h2>

          <p>We couldn't find this order.</p>

          <Link
            to="/my-orders"
            className="tracking-back-button"
          >
            View My Orders
          </Link>
        </div>
      </main>
    );
  }

  // =========================
  // NORMALIZE STATUS
  // =========================

  const currentStatus = normalizeStatus(order.status);

  const isCancelled = currentStatus === "Cancelled";

  const currentStepIndex = TRACKING_STEPS.findIndex(
    (step) => step.status === currentStatus
  );

  const activeStepIndex =
    currentStepIndex === -1 ? 0 : currentStepIndex;

  // =========================
  // RENDER
  // =========================

  return (
    <main className="tracking-page">

      {/* PAGE HEADER */}

      <div className="tracking-header">
        <div className="tracking-header-icon">
          🛵
        </div>

        <div className="tracking-header-content">
          <h1>Track Your Order</h1>

          <p>
            Order ID: #
            {order.id.slice(0, 8)}
          </p>
        </div>
      </div>

      {/* TRACKING CARD */}

      <section className="tracking-card">

        <div className="tracking-card-header">
          <div>
            <h2>Order Status</h2>

            <p>
              Follow your food as it makes its way
              to you
            </p>
          </div>

          <span
            className={`tracking-status-badge ${
              isCancelled ? "cancelled" : ""
            }`}
          >
            {currentStatus}
          </span>
        </div>

        {/* CANCELLED */}

        {isCancelled ? (
          <div className="cancelled-section">
            <div className="cancelled-icon">
              ❌
            </div>

            <h3>Order Cancelled</h3>

            <p>
              This order has been cancelled.
            </p>
          </div>
        ) : (
          <>
            {/* PROGRESS TRACKER */}

            <div className="tracking-progress">

              {TRACKING_STEPS.map((step, index) => {
                const isActive =
                  index <= activeStepIndex;

                const isCurrent =
                  index === activeStepIndex;

                return (
                  <div
                    className="tracking-step-wrapper"
                    key={step.status}
                  >

                    <div className="tracking-step">

                      <div
                        className={`tracking-step-icon ${
                          isActive ? "active" : ""
                        } ${
                          isCurrent ? "current" : ""
                        }`}
                      >
                        {step.icon}
                      </div>

                      <span
                        className={`tracking-step-label ${
                          isActive ? "active" : ""
                        }`}
                      >
                        {step.status}
                      </span>
                    </div>

                    {/* CONNECTOR */}

                    {index <
                      TRACKING_STEPS.length - 1 && (
                      <div
                        className={`tracking-connector ${
                          index < activeStepIndex
                            ? "active"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* CURRENT STATUS */}

            <div className="tracking-current-status">
              <span>Current status:</span>

              <strong>{currentStatus}</strong>
            </div>

            <p className="tracking-description">
              {
                TRACKING_STEPS[activeStepIndex]
                  ?.description
              }
            </p>
          </>
        )}
      </section>

      {/* ORDER DETAILS */}

      <section className="tracking-details">

        <h2>Order Details</h2>

        <div className="tracking-detail-row">
          <span>Order ID</span>

          <strong>
            #{order.id.slice(0, 8)}
          </strong>
        </div>

        <div className="tracking-detail-row">
          <span>Payment Method</span>

          <strong>
            {order.paymentMethod || "COD"}
          </strong>
        </div>

        <div className="tracking-detail-row">
          <span>Total Amount</span>

          <strong>
            ₹
            {order.grandTotal ??
              order.total ??
              order.amount ??
              0}
          </strong>
        </div>

        <div className="tracking-detail-row">
          <span>Order Date</span>

          <strong>
            {order.orderedAt
              ? new Date(
                  order.orderedAt
                ).toLocaleDateString()
              : "—"}
          </strong>
        </div>
      </section>

      {/* BACK BUTTON */}

      <div className="tracking-actions">
        <Link
          to="/my-orders"
          className="tracking-back-button"
        >
          ← Back to My Orders
        </Link>
      </div>

    </main>
  );
}

export default OrderTrackingPage;