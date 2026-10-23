import React from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.finalPrice || item.price) * (item.qty || 1),
    0
  );

  const delivery = subtotal > 500 ? 0 : cart.length > 0 ? 50 : 0;
  const finalTotal = subtotal + delivery;

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && (item.qty || 1) > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  const handleSingleCheckout = (item) => {
    navigate("/checkout", { state: { items: [item] } });
  };

  const handleCheckoutAll = () => {
    navigate("/checkout", { state: { items: cart } });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "auto" }}>
      <h2>Your Cart 🛒</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "15px",
                background: "#fff",
                padding: "15px",
                borderRadius: "12px",
                marginBottom: "15px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                alignItems: "center"
              }}
            >
              <img
                src={item.images?.[0] || ""}
                alt=""
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
              />

              <div style={{ flex: 1 }}>
                <h4>{item.name || "No Name"}</h4>

                <h3 style={{ color: "#2e7d32" }}>
                  ₹{Number(item.finalPrice || item.price)} × {item.qty || 1}
                </h3>

                <p>
                  ₹
                  {Number(item.finalPrice || item.price) *
                    (item.qty || 1)}
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.qty || 1}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>

                <button
                  className="btn-primary"
                  onClick={() => handleSingleCheckout(item)}
                >
                  Checkout
                </button>

                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    padding: "6px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}
          >
            <h3>Subtotal: ₹{subtotal}</h3>
            <p>
              Delivery:{" "}
              {delivery === 0 ? "FREE 🎉" : `₹${delivery}`}
            </p>
            <h2>Total: ₹{finalTotal}</h2>

            <button
              className="btn-primary"
              style={{ marginTop: "10px", width: "100%" }}
              onClick={handleCheckoutAll}
            >
              Checkout All 🛒
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;