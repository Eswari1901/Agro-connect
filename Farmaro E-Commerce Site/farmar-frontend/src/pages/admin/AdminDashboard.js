import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard({ products, orders, sellers, user }) {

  const navigate = useNavigate();

  const safeProducts = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  const safeOrders = useMemo(() => {
    return Array.isArray(orders) ? orders : [];
  }, [orders]);

  // 📦 PRODUCTS
  const totalProducts = safeProducts.length;

  // 🛒 ORDERS
  const totalOrders = safeOrders.length;

  // 👨‍🌾 SELLERS
  const totalSellers = new Set(
    safeProducts.map(p => p.sellerId)
  ).size;

  // 👥 USERS (basic logic)
  const totalUsers = 1;

  // 📅 DAILY INTERACTIONS
  const todayInteractions = useMemo(() => {
    const today = new Date().toDateString();

    return safeOrders.filter((o) =>
      new Date(o.id).toDateString() === today
    ).length;
  }, [safeOrders]);

  const totalInteractions = totalOrders;

  return (
    <div style={container}>

      {/* 🌾 LOGO */}
      <div
        style={logo}
        onClick={() => navigate("/admin")}
      >
        Agro Connect
      </div>

      <h2 style={title}>Admin Dashboard 📊</h2>

      {/* 🔢 STATS */}
      <div style={grid}>

        <div
          style={card}
          onClick={() => navigate("/admin/products")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h3>{totalProducts}</h3>
          <p>Products</p>
        </div>

        <div
          style={card}
          onClick={() => navigate("/admin/orders")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h3>{totalOrders}</h3>
          <p>Orders</p>
        </div>

        <div
          style={card}
          onClick={() => navigate("/admin/sellers")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h3>{totalSellers}</h3>
          <p>Sellers</p>
        </div>

        <div
          style={card}
          onClick={() => navigate("/admin/users")}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <h3>{totalUsers}</h3>
          <p>Users</p>
        </div>

        <div style={card}>
          <h3>{todayInteractions}</h3>
          <p>Today Activity</p>
        </div>

        <div style={card}>
          <h3>{totalInteractions}</h3>
          <p>Total Activity</p>
        </div>

      </div>

      {/* 📊 INSIGHT BOX */}
      <div style={insightBox}>
        <h3>Insights</h3>

        <p>📦 {totalProducts} products listed</p>
        <p>🛒 {totalOrders} orders placed</p>
        <p>👨‍🌾 {totalSellers} sellers onboarded</p>
        <p>🔥 {todayInteractions} activities today</p>
      </div>

    </div>
  );
}

/* 🎨 STYLES */

const container = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh"
};

const logo = {
  fontSize: "22px",
  fontWeight: "bold",
  cursor: "pointer",
  marginBottom: "15px",
  color: "#2e7d32"
};

const title = {
  fontSize: "26px",
  marginBottom: "20px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px"
};

const card = {
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  padding: "20px",
  borderRadius: "16px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  transition: "0.3s",
  cursor: "pointer"
};

const insightBox = {
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
};

export default AdminDashboard;