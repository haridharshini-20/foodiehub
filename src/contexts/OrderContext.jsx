
import { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";

export const OrderContext = createContext();

export const ORDER_STATUSES = [
  "Order Placed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// All statuses used by the tracking page
const STATUS_TIMELINE = [
  {
    status: "Order Placed",
    afterSeconds: 0,
  },
  {
    status: "Preparing",
    afterSeconds: 6,
  },
  {
    status: "Out for Delivery",
    afterSeconds: 14,
  },
  {
    status: "Delivered",
    afterSeconds: 24,
  },
];

// Convert old status names to the new standard names
export function normalizeOrderStatus(status) {
  const statusMap = {
    "Order Placed": "Order Placed",
    "Preparing": "Preparing",
    "Out for Delivery": "Out for Delivery",
    "Delivered": "Delivered",
    "Cancelled": "Cancelled",

    // Old status names
    "Placed": "Order Placed",
    "Pending": "Order Placed",
    "Sent to Kitchen": "Preparing",
    "Ready": "Out for Delivery",
    "Completed": "Delivered",
    "completed": "Delivered",
    "delivered": "Delivered",
    "cancelled": "Cancelled",
    "Canceled": "Cancelled",
  };

  return statusMap[status] || "Order Placed";
}

// Convert Firestore order into a consistent format
function normalizeOrder(order) {
  return {
    ...order,
    status: normalizeOrderStatus(order.status),
  };
}

// Automatically calculate status based on order time
function computeStatus(order) {
  const currentStatus = normalizeOrderStatus(order.status);

  // Never automatically change a cancelled order
  if (currentStatus === "Cancelled") {
    return "Cancelled";
  }

  // Already delivered orders stay delivered
  if (currentStatus === "Delivered") {
    return "Delivered";
  }

  const orderedTime = new Date(order.orderedAt).getTime();

  // Invalid or missing date
  if (Number.isNaN(orderedTime)) {
    return currentStatus;
  }

  const secondsElapsed =
    (Date.now() - orderedTime) / 1000;

  let status = STATUS_TIMELINE[0].status;

  for (const stage of STATUS_TIMELINE) {
    if (secondsElapsed >= stage.afterSeconds) {
      status = stage.status;
    }
  }

  return status;
}

// Load saved orders
function loadOrdersFromStorage() {
  try {
    const saved = localStorage.getItem("foodiehub_orders");

    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Storage loading error:", error);
    return [];
  }
}

function OrderProvider({ children }) {
  const [orders, setOrders] = useState(
    loadOrdersFromStorage
  );

  // =========================
  // LOAD ORDERS FROM FIRESTORE
  // =========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          setOrders([]);
          return;
        }

        try {
          const ordersQuery = query(
            collection(db, "orders"),
            where("userId", "==", user.uid)
          );

          const querySnapshot = await getDocs(
            ordersQuery
          );

          const firebaseOrders =
            querySnapshot.docs.map(
              (docSnapshot) =>
                normalizeOrder({
                  id: docSnapshot.id,
                  ...docSnapshot.data(),
                })
            );

          setOrders(firebaseOrders);
        } catch (error) {
          console.error(
            "Error loading orders:",
            error
          );
        }
      }
    );

    return unsubscribe;
  }, []);

  // =========================
  // SAVE TO LOCAL STORAGE
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "foodiehub_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  // =========================
  // AUTOMATIC STATUS UPDATE
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          const correctStatus =
            computeStatus(order);

          if (
            normalizeOrderStatus(order.status) ===
            correctStatus
          ) {
            return order;
          }

          return {
            ...order,
            status: correctStatus,
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // ADD ORDER
  // =========================

  const addOrder = async (orderData) => {
    try {
      if (!auth.currentUser) {
        console.error("User is not logged in.");
        return null;
      }

      const newOrder = {
        ...orderData,

        // Always use the same status
        status: "Order Placed",

        orderedAt: new Date().toISOString(),

        userId: auth.currentUser.uid,

        userEmail: auth.currentUser.email || "",
      };

      const docRef = await addDoc(
        collection(db, "orders"),
        newOrder
      );

      const savedOrder = {
        id: docRef.id,
        ...newOrder,
      };

      setOrders((prevOrders) => [
        ...prevOrders,
        savedOrder,
      ]);

      return savedOrder;
    } catch (error) {
      console.error(
        "Error saving order:",
        error
      );

      return null;
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const updateOrderStatus = async (id, status) => {
    try {
      const normalizedStatus =
        normalizeOrderStatus(status);

      await updateDoc(
        doc(db, "orders", id),
        {
          status: normalizedStatus,
          updatedAt: new Date().toISOString(),
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id
            ? {
                ...order,
                status: normalizedStatus,
              }
            : order
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      return false;
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (id) => {
    try {
      const order = orders.find(
        (item) => item.id === id
      );

      if (!order) {
        return false;
      }

      const currentStatus =
        normalizeOrderStatus(order.status);

      // Only these statuses can be cancelled
      if (
        currentStatus !== "Order Placed" &&
        currentStatus !== "Preparing"
      ) {
        return false;
      }

      await updateDoc(
        doc(db, "orders", id),
        {
          status: "Cancelled",
          updatedAt: new Date().toISOString(),
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "Cancelled",
              }
            : item
        )
      );

      return true;
    } catch (error) {
      console.error(
        "Error cancelling order:",
        error
      );

      return false;
    }
  };

  // =========================
  // GET ONE ORDER
  // =========================

  const getOrderById = (id) => {
    return orders.find(
      (order) => order.id === id
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrderById,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export default OrderProvider;