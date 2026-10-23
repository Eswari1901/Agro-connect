import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard({ products, orders, user }) {
  const navigate = useNavigate();

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  // ✅ FIX: match correct sellerId
  const sellerProducts = safeProducts.filter(
    (p) => p.sellerId === user?._id
  );

  // ✅ FIX: correct product matching
  const sellerOrders = safeOrders.filter((order) =>
    order.items?.some((item) =>
      sellerProducts.some((p) => p.id === item.id)
    )
  );

  const totalRevenue = useMemo(() => {
    return sellerOrders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );
  }, [sellerOrders]);

  const totalOrders = sellerOrders.length;

  return (
    <div style={container}>
      <h2 style={title}>Seller Dashboard 🌾</h2>

      <div style={grid}>
        <div style={card}>
          <p style={label}>Total Revenue</p>
          <h2>₹{totalRevenue}</h2>
        </div>

        <div style={card}>
          <p style={label}>Total Orders</p>
          <h2>{totalOrders}</h2>
        </div>

        <div style={card}>
          <p style={label}>My Products</p>
          <h2>{sellerProducts.length}</h2>
        </div>
      </div>

      <div style={btnContainer}>
        <button style={primaryBtn} onClick={() => navigate("/seller/add-product")}>
          ➕ Add Product
        </button>

        <button style={outlineBtn} onClick={() => navigate("/seller/my-products")}>
          📦 My Products
        </button>

        <button style={outlineBtn} onClick={() => navigate("/seller/orders")}>
          📊 Orders
        </button>
      </div>

      <div style={cardBox}>
        <h3>Recent Orders</h3>

        {sellerOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          sellerOrders.slice(0, 3).map((order) => (
            <div key={order._id} style={orderRow}>
              <div>
                <p><b>Order:</b> {order._id}</p>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {order.items.map((i) => i.name).join(", ")}
                </p>
              </div>

              <div>
                <p>₹{order.total}</p>
                <span style={status(order.status)}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* styles unchanged */

/* 🎨 STYLES */

const container = {
  padding: "30px",
  maxWidth: "1000px",
  margin: "auto",
  background: "#f8fafc",
  minHeight: "100vh"
};

const title = {
  fontSize: "26px",
  marginBottom: "20px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const label = {
  fontSize: "14px",
  color: "#666"
};

const btnContainer = {
  marginTop: "25px",
  display: "flex",
  gap: "15px"
};

const primaryBtn = {
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer"
};

const outlineBtn = {
  border: "1px solid #2e7d32",
  color: "#2e7d32",
  background: "#fff",
  padding: "10px 15px",
  borderRadius: "8px",
  cursor: "pointer"
};

const cardBox = {
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const orderRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee"
};

const status = (s) => ({
  background:
    s === "Delivered"
      ? "#2e7d32"
      : s === "Out for Delivery"
      ? "#ff9800"
      : "#2196f3",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px"
});

export default Dashboard;