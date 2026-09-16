import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import { OrderContext } from "../contexts/OrderContext";
import "./OrderConfirmationPage.css";

function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { getOrderById } = useContext(OrderContext);

  const order = getOrderById(orderId);

  // If the order isn't found (e.g. page was refreshed and memory was cleared)
  if (!order) {
    return (
      <section className="confirmation-page">
        <div className="confirmation-box">
          <h2>Order not found</h2>
          <p>
            We couldn't find this order. This can happen if you refreshed
            the page, since orders aren't saved permanently yet.
          </p>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="confirmation-page">
      <div className="confirmation-box">
        <div className="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-id">Order ID: {order.id}</p>

        <div className="confirmation-section">
          <h3>Items</h3>
          {order.items.map((item) => (
            <div className="confirmation-row" key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="confirmation-section">
          <h3>Delivery Address</h3>
          <p>{order.address.fullName} — {order.address.phone}</p>
          <p>
            {order.address.addressLine}, {order.address.city},{" "}
            {order.address.state} - {order.address.pincode}
          </p>
        </div>

        <div className="confirmation-section">
          <h3>Payment</h3>
          <p>
            {order.paymentMethod === "COD"
              ? "Cash on Delivery"
              : order.paymentMethod}
          </p>
        </div>

        <div className="confirmation-section total-section">
          <div className="confirmation-row">
            <span>Item Total</span>
            <span>₹{order.subtotal}</span>
          </div>
          <div className="confirmation-row">
            <span>Delivery Fee</span>
            <span>
              {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
            </span>
          </div>
          <div className="confirmation-row">
            <span>Taxes & GST</span>
            <span>₹{order.taxes}</span>
          </div>
          <hr />
          <div className="confirmation-row grand-total">
            <span>Total Paid</span>
            <span>₹{order.grandTotal}</span>
          </div>
        </div>

        <p className="status-badge">Status: {order.status}</p>

        <div className="confirmation-actions">
          <Link to={`/order-tracking/${order.id}`} className="track-btn">
            Track Order →
          </Link>
          <Link to="/" className="back-link">← Back to Home</Link>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmationPage;