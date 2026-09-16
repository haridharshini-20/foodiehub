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

const STATUS_TIMELINE = [
  { status: "Order Placed", afterSeconds: 0 },
  { status: "Preparing", afterSeconds: 6 },
  { status: "Out for Delivery", afterSeconds: 14 },
  { status: "Delivered", afterSeconds: 24 },
];

function computeStatus(order) {
  // Never change a cancelled order automatically
  if (order.status === "Cancelled") {
    return "Cancelled";
  }

  const secondsElapsed =
    (Date.now() - new Date(order.orderedAt).getTime()) / 1000;

  let status = STATUS_TIMELINE[0].status;

  for (const stage of STATUS_TIMELINE) {
    if (secondsElapsed >= stage.afterSeconds) {
      status = stage.status;
    }
  }

  return status;
}

function loadOrdersFromStorage() {
  try {
    const saved = localStorage.getItem("foodiehub_orders");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrdersFromStorage);

  // Load orders from Firestore when authentication is ready
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrders([]);
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(ordersQuery);

        const firebaseOrders = querySnapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));

        setOrders(firebaseOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    });

    return unsubscribe;
  }, []);

  // Save current orders to localStorage
  useEffect(() => {
    localStorage.setItem(
      "foodiehub_orders",
      JSON.stringify(orders)
    );
  }, [orders]);

  // Automatically update order status
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          // Cancelled orders must stay cancelled
          if (order.status === "Cancelled") {
            return order;
          }

          const correctStatus = computeStatus(order);

          return order.status === correctStatus
            ? order
            : {
                ...order,
                status: correctStatus,
              };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add a new order
  const addOrder = async (orderData) => {
    try {
      if (!auth.currentUser) {
        console.error("User is not logged in.");
        return null;
      }

      const newOrder = {
        status: "Order Placed",
        orderedAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        ...orderData,
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
      console.error("Error saving order:", error);
      return null;
    }
  };

  // Manually update order status
  const updateOrderStatus = (id, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  };

  // Cancel an order
  const cancelOrder = async (id) => {
    try {
      const order = orders.find(
        (item) => item.id === id
      );

      if (!order) {
        return false;
      }

      // Only Order Placed and Preparing can be cancelled
      if (
        order.status !== "Order Placed" &&
        order.status !== "Preparing"
      ) {
        return false;
      }

      // Update Firestore
      await updateDoc(doc(db, "orders", id), {
        status: "Cancelled",
      });

      // Update React state immediately
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

  // Find one order
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