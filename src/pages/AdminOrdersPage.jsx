import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import "./AdminOrdersPage.css";

function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const statuses = [
    "Order Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // ================================
  // LOAD ORDERS
  // ================================

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, "orders")
        );

        const ordersData = snapshot.docs.map((orderDoc) => ({
          id: orderDoc.id,
          ...orderDoc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // ================================
  // UPDATE STATUS
  // ================================

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      await updateDoc(
        doc(db, "orders", orderId),
        {
          status: newStatus,
        }
      );

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Error updating order:",
        error
      );

      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <section className="admin-orders-page">
        <div className="admin-orders-loading">
          📦 Loading orders...
        </div>
      </section>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <section className="admin-orders-page">

      {/* HEADER */}

      <div className="admin-orders-header">
        <div>
          <h1>📦 Manage Orders</h1>

          <p>
            View and update customer orders.
          </p>
        </div>

        <div className="orders-count">
          {orders.length} Orders
        </div>
      </div>

      {/* EMPTY */}

      {orders.length === 0 ? (
        <div className="admin-orders-empty">

          <div className="empty-order-icon">
            📦
          </div>

          <h2>No Orders Found</h2>

          <p>
            Customer orders will appear here.
          </p>

        </div>
      ) : (
        <div className="admin-orders-list">

          {orders.map((order) => {
            const currentStatus =
              order.status || "Order Placed";

            const statusClass = currentStatus
              .toLowerCase()
              .replaceAll(" ", "-");

            // ================================
            // ADDRESS DATA
            // ================================

            const address =
              order.address &&
              typeof order.address === "object"
                ? order.address
                : null;

            const customerName =
              order.name ||
              order.customerName ||
              address?.fullName ||
              "Customer";

            const phone =
              order.phone ||
              address?.phone ||
              "-";

            const addressLine =
              address?.addressLine ||
              address?.address ||
              (typeof order.address === "string"
                ? order.address
                : "");

            const city =
              address?.city || "";

            const state =
              address?.state || "";

            const pincode =
              address?.pincode || "";

            return (
              <div
                className="admin-order-card"
                key={order.id}
              >

                {/* ================================
                    ORDER HEADER
                ================================ */}

                <div className="admin-order-top">

                  <div>
                    <h3>
                      Order #
                      {order.id.slice(0, 8)}
                    </h3>

                    <p>
                      {order.email ||
                        order.customerEmail ||
                        "Customer"}
                    </p>
                  </div>

                  <span
                    className={`admin-order-status ${statusClass}`}
                  >
                    {currentStatus}
                  </span>

                </div>

                {/* ================================
                    CUSTOMER INFORMATION
                ================================ */}

                <div className="admin-customer-info">

                  <div>
                    <span>Customer</span>

                    <strong>
                      {customerName}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>

                    <strong>
                      {phone}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery Address</span>

                    <strong>
                      {addressLine || "-"}
                    </strong>

                    {(city ||
                      state ||
                      pincode) && (
                      <small>
                        {city}

                        {city && state
                          ? ", "
                          : ""}

                        {state}

                        {(city || state) &&
                        pincode
                          ? " - "
                          : ""}

                        {pincode}
                      </small>
                    )}
                  </div>

                </div>

                {/* ================================
                    ORDER ITEMS
                ================================ */}

                <div className="admin-order-items">

                  <h4>
                    Ordered Items
                  </h4>

                  {Array.isArray(order.items) &&
                  order.items.length > 0 ? (
                    order.items.map(
                      (item, index) => (
                        <div
                          className="admin-order-item"
                          key={index}
                        >

                          <div className="admin-item-info">

                            {item.image && (
                              <img
                                src={item.image}
                                alt={
                                  item.name ||
                                  "Food"
                                }
                              />
                            )}

                            <div>
                              <strong>
                                {item.name ||
                                  "Food Item"}
                              </strong>

                              <span>
                                Qty:{" "}
                                {item.quantity ||
                                  1}
                              </span>
                            </div>

                          </div>

                          <strong>
                            ₹
                            {Number(
                              item.price || 0
                            ) *
                              Number(
                                item.quantity ||
                                  1
                              )}
                          </strong>

                        </div>
                      )
                    )
                  ) : (
                    <p className="no-items">
                      No item details available.
                    </p>
                  )}

                </div>

                {/* ================================
                    BOTTOM
                ================================ */}

                <div className="admin-order-bottom">

                  <div className="admin-order-total">

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹
                      {order.total ||
                        order.grandTotal ||
                        order.amount ||
                        0}
                    </strong>

                  </div>

                  {/* STATUS */}

                  <div className="status-control">

                    <label>
                      Update Status
                    </label>

                    <select
                      value={currentStatus}
                      disabled={
                        updatingId ===
                        order.id
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value
                        )
                      }
                    >

                      {statuses.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default AdminOrdersPage;