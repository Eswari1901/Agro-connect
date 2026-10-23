import React from "react";
import { useNavigate } from "react-router-dom";

function AdminProducts({ products, setProducts }) {

  const navigate = useNavigate();
  const safeProducts = Array.isArray(products) ? products : [];

  const pendingProducts = safeProducts.filter(p => p.status !== "approved");
  const approvedProducts = safeProducts.filter(p => p.status === "approved");

  const handleApprove = (id) => {
    setProducts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: "approved" } : p
      )
    );
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const renderCard = (product, isApproved) => (
    <div
      key={product.id}
      style={card}
      onClick={() => navigate(`/admin/products/${product.id}`)}
    >
      <img src={product.images?.[0] || product.image}
        alt={product.name} style={image} />

      <div style={{ padding: "10px" }}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <p><b>Seller:</b> {product.sellerName || "Unknown"}</p>

        <h3 style={{ color: "#2e7d32" }}>₹{product.price}</h3>

        <span style={isApproved ? approvedBadge : pendingBadge}>
          {isApproved ? "Approved" : "Pending"}
        </span>
      </div>

      <div style={actions}>
        {!isApproved && (
          <button
            style={approveBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleApprove(product.id);
            }}
          >
            Approve
          </button>
        )}

        <button
          style={deleteBtn}
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(product.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div style={container}>
      <h2>Admin Product Approval</h2>

      <h3>Pending</h3>
      <div style={grid}>
        {pendingProducts.map(p => renderCard(p, false))}
      </div>

      <h3>Approved</h3>
      <div style={grid}>
        {approvedProducts.map(p => renderCard(p, true))}
      </div>
    </div>
  );
}

/* keep styles same */

/* 🎨 STYLES */

const container = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh"
};

// const title = {
//   fontSize: "26px",
//   marginBottom: "20px"
// };

// const sectionTitle = {
//   marginTop: "20px",
//   marginBottom: "10px"
// };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "20px"
};

const card = {
  background: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  transition: "0.3s"
};

const image = {
  width: "100%",
  height: "160px",
  objectFit: "cover"
};

// const desc = {
//   fontSize: "13px",
//   color: "#666",
//   height: "40px",
//   overflow: "hidden"
// };

const pendingBadge = {
  display: "inline-block",
  background: "#ff9800",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  marginTop: "5px"
};

const approvedBadge = {
  display: "inline-block",
  background: "#2e7d32",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  marginTop: "5px"
};

const actions = {
  display: "flex",
  gap: "10px",
  padding: "10px"
};

const approveBtn = {
  flex: 1,
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
};

const deleteBtn = {
  flex: 1,
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
};

export default AdminProducts;