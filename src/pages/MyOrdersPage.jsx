import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { OrderContext } from "../contexts/OrderContext";
import { AuthContext } from "../contexts/AuthContext";
import "./MyOrdersPage.css";

function MyOrdersPage() {
  const { orders, cancelOrder } = useContext(OrderContext);
  const { currentUser } = useContext(AuthContext);
  const [cancelling, setCancelling] = useState(false);

  // If not logged in
  if (!currentUser) {
    return (
      <section className="my-orders-page">
        <div className="orders-header">
          <h1>📦 My Orders</h1>
          <p>Track and manage your Foodie Hub orders</p>
        </div>

        <div className="empty-orders">
          <div className="empty-icon">🔐</div>

          <h2>Please Login</h2>

          <p>
            Login to view your previous orders and track your deliveries.
          </p>

          <Link to="/login" className="order-menu-btn">
            Login to Continue
          </Link>
        </div>
      </section>
    );
  }

  // Show only this user's orders
  const userOrders = orders.filter(
    (order) => order.userId === currentUser.uid
  );

  // Latest orders first
  const sortedOrders = [...userOrders].sort(
    (a, b) =>
      new Date(b.orderedAt) - new Date(a.orderedAt)
  );

  return (
    <section className="my-orders-page">

      {/* Header */}
      <div className="orders-header">
        <h1>📦 My Orders</h1>

        <p>
          Track and manage all your Foodie Hub orders
        </p>
      </div>

      {/* No Orders */}
      {sortedOrders.length === 0 ? (
        <div className="empty-orders">

          <div className="empty-icon">
            🍽️
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
            Discover something delicious today!
          </p>

          <Link
            to="/"
            className="order-menu-btn"
          >
            🍔 Browse Menu
          </Link>

        </div>
      ) : (

        /* Orders */
        <div className="orders-container">

          {sortedOrders.map((order) => (

            <div
              className="order-card"
              key={order.id}
            >

              {/* Order Top */}
              <div className="order-top">

                <div>
                  <div className="order-id">
                    Order #{order.id.slice(0, 8)}
                  </div>

                  <div className="order-date">
                    {new Date(
                      order.orderedAt
                    ).toLocaleString()}
                  </div>
                </div>

                <span
                  className={`order-status status-${order.status
                    .replace(/\s+/g, "-")
                    .toLowerCase()}`}
                >
                  {order.status}
                </span>

              </div>

              {/* Items */}
              <div className="order-items">

                {order.items.map((item) => (

                  <div
                    className="order-item"
                    key={item.id}
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="order-item-info">

                      <h4>
                        {item.name}
                      </h4>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                    </div>

                    <span className="order-item-price">
                      ₹{item.price * item.quantity}
                    </span>

                  </div>

                ))}

              </div>

              {/* Bottom */}
              <div className="order-bottom">

                <div className="order-total">
                  Total:&nbsp;

                  <strong>
                    ₹{order.grandTotal}
                  </strong>
                </div>

                <Link
  to={`/order-tracking/${order.id}`}
  className="track-order-btn"
>
  🛵 Track Order →
</Link>

{(order.status === "Order Placed" ||
  order.status === "Preparing") && (
  <button
    type="button"
    className="cancel-order-btn"
    onClick={async (e) => {
      e.preventDefault();

      const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmCancel) return;

      setCancelling(true);

      const success = await cancelOrder(order.id);

      setCancelling(false);

      if (!success) {
        alert("Unable to cancel this order.");
      }
    }}
    disabled={cancelling}
  >
    {cancelling
      ? "Cancelling..."
      : "✕ Cancel Order"}
  </button>
)}

              </div>

            </div>

          ))}

        </div>
      )}

    </section>
  );
}

export default MyOrdersPage;