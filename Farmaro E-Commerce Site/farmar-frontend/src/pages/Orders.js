import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered"
];

function Orders({ orders, setOrders, setCart }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // 🚀 FETCH ORDERS FROM BACKEND
  useEffect(() => {
  const fetchOrders = () => {
    fetch("http://localhost:5000/orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then((res) => res.json())
      .then(setOrders);
  };

  fetchOrders();

  const interval = setInterval(fetchOrders, 3000); // 🔥 LIVE UPDATE

  return () => clearInterval(interval);
}, [setOrders]);

  const getStepIndex = (status) => steps.indexOf(status);

  // 📅 DELIVERY DATE
  const getDeliveryDate = (id) => {
    const date = new Date(id);
    date.setDate(date.getDate() + 3);
    return date.toDateString();
  };

  // 🔁 REORDER
  const handleReorder = (items) => {
    setCart((prev) => [...prev, ...items]);
    alert("Added to cart 🛒");
    navigate("/cart");
  };

  // 🧑‍🌾 SELLER STATUS UPDATE
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status })
      });

      // refresh orders
      const res = await fetch("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setOrders(data);
    } catch {
      alert("Update failed");
    }
  };

  // ✅ CUSTOMER CONFIRM DELIVERY
  const handleReceived = (id) => {
    updateStatus(id, "Delivered");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "#2e7d32";
      case "Out for Delivery":
        return "#ff9800";
      case "Shipped":
        return "#2196f3";
      case "Packed":
        return "#673ab7";
      default:
        return "#999";
    }
  };

  return (
    <div style={container}>
      <h2>My Orders 📦</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => {
          const activeIndex = getStepIndex(order.status);

          return (
            <div key={order._id} style={card}>
              
              {/* HEADER */}
              <div style={header}>
                <div>
                  <p><b>Order ID:</b> {order._id}</p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    {getDeliveryDate(order._id)}
                  </p>
                </div>

                <div
                  style={{
                    background: getStatusColor(order.status),
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "12px"
                  }}
                >
                  {order.status}
                </div>
              </div>

              {/* PRODUCTS */}
              {order.items.map((item, i) => (
                <div key={i} style={itemRow}>
                  <span>{item.name} × {item.qty || 1}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}

              <p><b>Total:</b> ₹{order.total}</p>

              {/* TIMELINE */}
              <div style={progressContainer}>
                <div
                  style={{
                    ...progressLine,
                    width: `${(activeIndex / (steps.length - 1)) * 100}%`
                  }}
                />

                {steps.map((step, i) => {
                  const active = i <= activeIndex;

                  return (
                    <div key={step} style={stepWrapper}>
                      <div
                        style={{
                          ...circle,
                          background: active ? "#2e7d32" : "#ccc"
                        }}
                      >
                        {active ? "✔" : ""}
                      </div>
                      <p style={label}>{step}</p>
                    </div>
                  );
                })}
              </div>

              {/* LIVE STATUS */}
              {order.status !== "Delivered" && (
                <div style={mapBox}>
                  🚚 Your order is moving...
                </div>
              )}

              {/* BUTTONS */}
              <div style={btnRow}>

                {/* REORDER */}
                <button
                  style={outlineBtn}
                  onClick={() => handleReorder(order.items)}
                >
                  Reorder
                </button>

                {/* CUSTOMER BUTTON */}
                {order.status === "Out for Delivery" && (
                  <button
                    style={primaryBtn}
                    onClick={() => handleReceived(order._id)}
                  >
                    Order Received ✅
                  </button>
                )}

                {/* SELLER CONTROLS */}
                {user?.role === "seller" && (
                  <>
                    {order.status === "Placed" && (
                      <button
                        style={primaryBtn}
                        onClick={() => updateStatus(order._id, "Packed")}
                      >
                        Mark Packed 📦
                      </button>
                    )}

                    {order.status === "Packed" && (
                      <button
                        style={primaryBtn}
                        onClick={() => updateStatus(order._id, "Shipped")}
                      >
                        Mark Shipped 🚚
                      </button>
                    )}

                    {order.status === "Shipped" && (
                      <button
                        style={primaryBtn}
                        onClick={() =>
                          updateStatus(order._id, "Out for Delivery")
                        }
                      >
                        Out for Delivery 🚴
                      </button>
                    )}
                  </>
                )}

              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* STYLES (UNCHANGED) */

const container = { padding: "20px", maxWidth: "900px", margin: "auto" };
const card = { background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" };
const header = { display: "flex", justifyContent: "space-between", marginBottom: "10px" };
const itemRow = { display: "flex", justifyContent: "space-between" };
const progressContainer = { position: "relative", display: "flex", marginTop: "20px" };
const progressLine = { position: "absolute", top: "10px", left: 0, height: "4px", background: "#2e7d32" };
const stepWrapper = { flex: 1, textAlign: "center" };
const circle = { width: "22px", height: "22px", borderRadius: "50%", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px" };
const label = { fontSize: "11px" };
const mapBox = { marginTop: "10px", padding: "10px", background: "#f5f5f5", borderRadius: "8px" };
const btnRow = { display: "flex", gap: "10px", marginTop: "15px", flexWrap: "wrap" };
const primaryBtn = { background: "#2e7d32", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" };
const outlineBtn = { border: "1px solid #2e7d32", color: "#2e7d32", background: "#fff", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" };

export default Orders;