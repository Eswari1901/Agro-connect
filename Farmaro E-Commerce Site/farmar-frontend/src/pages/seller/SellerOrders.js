import React from "react";

function SellerOrders({ orders, products, setOrders , user}) {

  // ✅ FIX: Use correct product ID
  const sellerProducts = products.filter(
  (p) => p.sellerId === user?._id
);

const sellerOrders = orders.filter((order) =>
  order.items?.some((item) =>
    sellerProducts.some((p) => p.id === item.id)
  )
);

  // 🚀 UPDATE ORDER STATUS (CONNECTED TO BACKEND)
  const updateStatus = async (id, newStatus) => {
    try {
      const currentOrder = orders.find((o) => o._id === id);

      // ✅ Step-by-step flow if no dropdown value
      if (!newStatus && currentOrder) {
        if (currentOrder.status === "Placed") newStatus = "Packed";
        else if (currentOrder.status === "Packed") newStatus = "Shipped";
        else if (currentOrder.status === "Shipped") newStatus = "Out for Delivery";
        else if (currentOrder.status === "Out for Delivery") newStatus = "Delivered";
      }

      // ✅ FIX: Proper fetch syntax
      await fetch(`http://localhost:5000/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      // 🔥 REFRESH FROM BACKEND
      const res = await fetch("http://localhost:5000/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.log(err);
      alert("Status update failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Seller Orders 📦</h2>

      {sellerOrders.length === 0 && <p>No orders yet</p>}

      {sellerOrders.map((order) => (
        <div key={order._id} style={card}>

          <p><b>Order ID:</b> {order._id}</p>

          {/* ✅ SHOW ONLY SELLER ITEMS */}
          {order.items
            .filter((item) =>
              sellerProducts.includes(item._id || item.id || item.productId)
            )
            .map((item, idx) => (
              <p key={idx}>
                {item.name} - ₹{item.price}
              </p>
            ))}

          <p><b>Status:</b> {order.status}</p>

          {/* 🔥 BUTTON FLOW */}
          {order.status !== "Delivered" && (
            <button
              style={button}
              onClick={() => updateStatus(order._id)}
            >
              {order.status === "Placed" && "Mark as Packed 📦"}
              {order.status === "Packed" && "Mark as Shipped 🚚"}
              {order.status === "Shipped" && "Out for Delivery 🚀"}
              {order.status === "Out for Delivery" && "Mark as Delivered ✅"}
            </button>
          )}

          {/* 🔥 DROPDOWN */}
          <select
            style={select}
            value={order.status}
            onChange={(e) =>
              updateStatus(order._id, e.target.value)
            }
          >
            <option value="Placed">Placed</option>
            <option value="Packed">Packed</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>

        </div>
      ))}
    </div>
  );
}

// 🎨 Styles
const card = {
  background: "#fff",
  padding: "15px",
  marginBottom: "12px",
  borderRadius: "12px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const button = {
  marginTop: "10px",
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#4CAF50",
  color: "#fff",
  cursor: "pointer"
};

const select = {
  display: "block",
  marginTop: "10px",
  padding: "6px",
  borderRadius: "6px"
};

export default SellerOrders;