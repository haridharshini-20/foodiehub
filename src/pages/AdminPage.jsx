import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./AdminPage.css";

function AdminPage() {
 const [stats, setStats] = useState({
  users: 0,
  orders: 0,
  pending: 0,
  delivered: 0,
  revenue: 0,
  orderPlaced: 0,
  preparing: 0,
  outForDelivery: 0,
  cancelled: 0,
});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // =========================
        // USERS
        // =========================

        const usersSnapshot = await getDocs(
          collection(db, "users")
        );

        // =========================
        // ORDERS
        // =========================

        const ordersSnapshot = await getDocs(
          collection(db, "orders")
        );

        const orders = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // =========================
        // ORDER COUNTS
        // =========================

        const pendingOrders = orders.filter(
          (order) =>
            order.status === "Order Placed" ||
            order.status === "Preparing" ||
            order.status === "Out for Delivery"
        );

        const deliveredOrders = orders.filter(
          (order) => order.status === "Delivered"
        );
        const orderPlaced = orders.filter(
  (order) => order.status === "Order Placed"
).length;

const preparing = orders.filter(
  (order) => order.status === "Preparing"
).length;

const outForDelivery = orders.filter(
  (order) => order.status === "Out for Delivery"
).length;

const cancelled = orders.filter(
  (order) => order.status === "Cancelled"
).length;

        // =========================
        // REVENUE
        // =========================

        const revenue = orders
          .filter((order) => order.status !== "Cancelled")
          .reduce(
            (total, order) =>
              total +
              Number(
                order.total ||
                order.grandTotal ||
                order.amount ||
                0
              ),
            0
          );

        // =========================
        // SET STATS
        // =========================

       setStats({
  users: usersSnapshot.size,
  orders: orders.length,
  pending: pendingOrders.length,
  delivered: deliveredOrders.length,
  revenue,
  orderPlaced,
  preparing,
  outForDelivery,
  cancelled,
});

        // Show latest 5 orders
        setRecentOrders(orders.slice(0, 5));

      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <section className="admin-page">
        <div className="admin-loading">
          🛡️ Loading Admin Dashboard...
        </div>
      </section>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <section className="admin-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="admin-header">

        <div>
          <h1>🛡️ Admin Dashboard</h1>

          <p>
            Manage Foodie Hub users, orders
            and deliveries.
          </p>
        </div>

        <div className="admin-badge">
          ADMIN
        </div>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="admin-stats">

        {/* USERS */}

        <div className="admin-stat-card">

          <div className="stat-icon">
            👥
          </div>

          <div>
            <h3>
              {stats.users}
            </h3>

            <p>
              Total Users
            </p>
          </div>

        </div>


        {/* ORDERS */}

        <div className="admin-stat-card">

          <div className="stat-icon">
            📦
          </div>

          <div>
            <h3>
              {stats.orders}
            </h3>

            <p>
              Total Orders
            </p>
          </div>

        </div>


        {/* PENDING */}

        <div className="admin-stat-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>
            <h3>
              {stats.pending}
            </h3>

            <p>
              Pending Orders
            </p>
          </div>

        </div>


        {/* DELIVERED */}

        <div className="admin-stat-card">

          <div className="stat-icon">
            ✅
          </div>

          <div>
            <h3>
              {stats.delivered}
            </h3>

            <p>
              Delivered
            </p>
          </div>

        </div>


        {/* REVENUE */}

        <div className="admin-stat-card revenue-card">

          <div className="stat-icon">
            💰
          </div>

          <div>
            <h3>
              ₹{stats.revenue}
            </h3>

            <p>
              Total Revenue
            </p>
          </div>

        </div>

      </div>
      {/* =========================
    ORDER STATUS BREAKDOWN
========================= */}

<div className="admin-status-section">

  <div className="admin-section-header">
    <div>
      <h2>📊 Order Status</h2>

      <p>
        Current order distribution
      </p>
    </div>
  </div>

  <div className="status-breakdown">

    <div className="status-breakdown-card placed">
      <div className="breakdown-icon">🧾</div>

      <div>
        <h3>{stats.orderPlaced}</h3>
        <p>Order Placed</p>
      </div>
    </div>

    <div className="status-breakdown-card preparing">
      <div className="breakdown-icon">👨‍🍳</div>

      <div>
        <h3>{stats.preparing}</h3>
        <p>Preparing</p>
      </div>
    </div>

    <div className="status-breakdown-card delivery">
      <div className="breakdown-icon">🛵</div>

      <div>
        <h3>{stats.outForDelivery}</h3>
        <p>Out for Delivery</p>
      </div>
    </div>

    <div className="status-breakdown-card delivered">
      <div className="breakdown-icon">🎉</div>

      <div>
        <h3>{stats.delivered}</h3>
        <p>Delivered</p>
      </div>
    </div>

    <div className="status-breakdown-card cancelled">
      <div className="breakdown-icon">❌</div>

      <div>
        <h3>{stats.cancelled}</h3>
        <p>Cancelled</p>
      </div>
    </div>

  </div>

</div>


      {/* =========================
          RECENT ORDERS
      ========================= */}

      <div className="admin-orders">

        <div className="admin-section-header">

          <div>
            <h2>
              📋 Recent Orders
            </h2>

            <p>
              Latest customer orders
            </p>
          </div>

        </div>


        {recentOrders.length === 0 ? (

          <div className="no-orders">
            <div>
              📦
            </div>

            <h3>
              No orders found
            </h3>

            <p>
              Customer orders will appear here.
            </p>
          </div>

        ) : (

          <div className="orders-table">

            {/* TABLE HEADER */}

            <div className="table-header">

              <span>
                Order ID
              </span>

              <span>
                Customer
              </span>

              <span>
                Total
              </span>

              <span>
                Status
              </span>

            </div>


            {/* ORDERS */}

            {recentOrders.map((order) => {

              const status =
                order.status ||
                "Order Placed";

              const statusClass =
                status
                  .toLowerCase()
                  .replaceAll(" ", "-");

              return (
                <div
                  className="table-row"
                  key={order.id}
                >

                  {/* ORDER ID */}

                  <span className="order-id">
                    #{order.id.slice(0, 8)}
                  </span>


                  {/* CUSTOMER */}

                  <span className="customer-name">

                    {order.name ||
                      order.customerName ||
                      order.email ||
                      "Customer"}

                  </span>


                  {/* TOTAL */}

                  <span className="order-total">

                    ₹
                    {order.total ||
                      order.grandTotal ||
                      order.amount ||
                      0}

                  </span>


                  {/* STATUS */}

                  <span
                    className={`order-status ${statusClass}`}
                  >
                    {status}
                  </span>

                </div>
              );
            })}

          </div>

        )}

      </div>


      {/* =========================
          QUICK INFORMATION
      ========================= */}

      <div className="admin-info-grid">

        <div className="admin-info-card">

          <div className="info-icon">
            👥
          </div>

          <div>
            <h3>
              Users
            </h3>

            <p>
              {stats.users} registered
              user{stats.users !== 1 ? "s" : ""}
            </p>
          </div>

        </div>


        <div className="admin-info-card">

          <div className="info-icon">
            🚚
          </div>

          <div>
            <h3>
              Delivery
            </h3>

            <p>
              {stats.pending} order
              {stats.pending !== 1 ? "s" : ""}
              currently in progress
            </p>
          </div>

        </div>


        <div className="admin-info-card">

          <div className="info-icon">
            💵
          </div>

          <div>
            <h3>
              Revenue
            </h3>

            <p>
              ₹{stats.revenue} from
              non-cancelled orders
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default AdminPage;