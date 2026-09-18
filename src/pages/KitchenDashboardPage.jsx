import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

function KitchenDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      const ordersQuery = query(
        collection(db, "orders"),
        where("status", "in", [
          "Order Placed",
          "Sent to Kitchen",
          "Preparing",
          "Ready",
        ])
      );

      const snapshot = await getDocs(ordersQuery);

      const ordersData = snapshot.docs.map((orderDoc) => ({
        id: orderDoc.id,
        ...orderDoc.data(),
      }));

      setOrders(ordersData);
    } catch (error) {
      console.error(
        "Error loading kitchen orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      await updateDoc(
        doc(db, "orders", orderId),
        {
          status: newStatus,
          updatedAt: new Date().toISOString(),
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

      // Remove completed/cancelled orders
      if (
        newStatus === "Completed" ||
        newStatus === "Cancelled"
      ) {
        setOrders((previousOrders) =>
          previousOrders.filter(
            (order) => order.id !== orderId
          )
        );
      }
    } catch (error) {
      console.error(
        "Error updating kitchen order:",
        error
      );

      alert("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case "Order Placed":
        return {
          label: "Send to Kitchen",
          nextStatus: "Sent to Kitchen",
        };

      case "Sent to Kitchen":
        return {
          label: "Accept & Start Preparing",
          nextStatus: "Preparing",
        };

      case "Preparing":
        return {
          label: "Mark Ready",
          nextStatus: "Ready",
        };

      case "Ready":
        return {
          label: "Complete Order",
          nextStatus: "Completed",
        };

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-loading">
          👨‍🍳 Loading Kitchen Dashboard...
        </div>
      </section>
    );
  }

  return (
    <section
      className="admin-page"
      style={{ paddingBottom: "40px" }}
    >
      {/* HEADER */}

      <div className="admin-header">
        <div>
          <h1>👨‍🍳 Kitchen Dashboard</h1>

          <p>
            Receive and process customer orders.
          </p>
        </div>

        <div className="admin-badge">
          KITCHEN
        </div>
      </div>

      {/* ORDER COUNT */}

      <div
        className="admin-stat-card"
        style={{
          marginBottom: "25px",
          maxWidth: "260px",
        }}
      >
        <div className="stat-icon">
          📦
        </div>

        <div>
          <h3>{orders.length}</h3>
          <p>Active Kitchen Orders</p>
        </div>
      </div>

      {/* ORDERS */}

      {orders.length === 0 ? (
        <div className="no-orders">
          <div style={{ fontSize: "50px" }}>
            👨‍🍳
          </div>

          <h3>No Active Orders</h3>

          <p>
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {orders.map((order) => {
            const currentStatus =
              order.status || "Order Placed";

            const action =
              getNextAction(currentStatus);

            const customerName =
              order.name ||
              order.customerName ||
              order.email ||
              "Customer";

            return (
              <div
                className="admin-order-card"
                key={order.id}
              >
                {/* ORDER HEADER */}

                <div className="admin-order-top">
                  <div>
                    <h3>
                      Order #
                      {order.id.slice(0, 8)}
                    </h3>

                    <p>
                      {customerName}
                    </p>
                  </div>

                  <span
                    className={`admin-order-status ${currentStatus
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {currentStatus}
                  </span>
                </div>

                {/* ITEMS */}

                <div className="admin-order-items">
                  <h4>🍽️ Order Items</h4>

                  {Array.isArray(
                    order.items
                  ) &&
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
                    <p>
                      No item details available.
                    </p>
                  )}
                </div>

                {/* TOTAL */}

                <div
                  className="admin-order-bottom"
                >
                  <div className="admin-order-total">
                    <span>Total</span>

                    <strong>
                      ₹
                      {order.total ||
                        order.grandTotal ||
                        order.amount ||
                        0}
                    </strong>
                  </div>

                  {/* ACTION */}

                  {action && (
                    <button
                      type="button"
                      disabled={
                        updatingId === order.id
                      }
                      onClick={() =>
                        updateStatus(
                          order.id,
                          action.nextStatus
                        )
                      }
                    >
                      {updatingId === order.id
                        ? "Updating..."
                        : action.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default KitchenDashboardPage;