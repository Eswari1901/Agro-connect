import React from "react";

function Sellers({ sellers, setSellers }) {

  const safeSellers = Array.isArray(sellers) ? sellers : [];

  // ✅ APPROVE SELLER
  const handleApprove = (id) => {
    setSellers((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "approved" } : s
      )
    );
  };

  // ❌ REMOVE SELLER (WORKS ALWAYS)
  const handleRemove = (id) => {
    setSellers((prev) =>
      prev.filter((s) => s.id !== id)
    );
  };

  const pending = safeSellers.filter(
    (s) => s.status !== "approved"
  );

  const approved = safeSellers.filter(
    (s) => s.status === "approved"
  );

  return (
    <div style={container}>
      <h2 style={title}>Seller Approval 👨‍🌾</h2>

      {/* 🟡 PENDING SELLERS */}
      <h3 style={section}>Pending Sellers ⏳</h3>

      {pending.length === 0 ? (
        <p>No pending sellers</p>
      ) : (
        <div style={grid}>
          {pending.map((seller) => (
            <div
              key={seller.id}
              style={card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div>
                <h3>{seller.name}</h3>
                <span style={pendingBadge}>Pending</span>
              </div>

              <div style={actions}>
                <button
                  style={approveBtn}
                  onClick={() => handleApprove(seller.id)}
                >
                  Approve ✅
                </button>

                <button
                  style={deleteBtn}
                  onClick={() => handleRemove(seller.id)}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🟢 APPROVED SELLERS */}
      <h3 style={section}>Approved Sellers ✅</h3>

      {approved.length === 0 ? (
        <p>No approved sellers</p>
      ) : (
        <div style={grid}>
          {approved.map((seller) => (
            <div
              key={seller.id}
              style={card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div>
                <h3>{seller.name}</h3>
                <span style={approvedBadge}>Approved</span>
              </div>

              <div style={actions}>
                <button
                  style={deleteBtn}
                  onClick={() => handleRemove(seller.id)}
                >
                  Remove ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  padding: "30px",
  background: "#f8fafc",
  minHeight: "100vh"
};

const title = {
  fontSize: "26px",
  marginBottom: "20px"
};

const section = {
  marginTop: "20px",
  marginBottom: "10px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "20px"
};

const card = {
  background: "#fff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "0.3s"
};

const pendingBadge = {
  background: "#ff9800",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  marginTop: "5px",
  display: "inline-block"
};

const approvedBadge = {
  background: "#2e7d32",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  marginTop: "5px",
  display: "inline-block"
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "15px"
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

export default Sellers;