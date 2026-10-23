import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={container}>
      <div style={circle}>✔</div>

      <h1>Order Placed Successfully 🎉</h1>
      <p>Your order is being processed</p>

      <p style={{ color: "#888" }}>
        Redirecting to orders...
      </p>
    </div>
  );
}

const container = {
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

const circle = {
  width: "80px",
  height: "80px",
  borderRadius: "50%",
  background: "#2e7d32",
  color: "#fff",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  marginBottom: "20px",
  animation: "pop 0.5s ease"
};

export default Success;