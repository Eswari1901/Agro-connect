import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const COUPONS = [
  { code: "SAVE10", discount: 0.1, minOrder: 200 },
  { code: "FARM20", discount: 0.2, minOrder: 500 },
  { code: "WELCOME50", discount: 50, minOrder: 300, type: "flat" }
];

function Checkout({ cart, setCart, setOrders }) {
  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || cart || [];

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: ""
  });

  const [payment, setPayment] = useState("cod");
  const [savedAddresses, setSavedAddresses] = useState(
    JSON.parse(localStorage.getItem("addresses")) || []
  );

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item?.price || 0) * (item?.qty || 1),
    0
  );

  const delivery = subtotal > 500 ? 0 : 50;

  const [selectedCoupon, setSelectedCoupon] = useState(null);

  // 🔥 SPLIT COUPONS
  const availableCoupons = COUPONS.filter(c => subtotal >= c.minOrder);
  const notAvailableCoupons = COUPONS.filter(c => subtotal < c.minOrder);

  // 🔥 BEST COUPON
  const bestCoupon = useMemo(() => {
  let best = null;
  let max = 0;

  availableCoupons.forEach((c) => {
    const value =
      c.type === "flat" ? c.discount : subtotal * c.discount;

    if (value > max) {
      max = value;
      best = c;
    }
  });

  return best;
}, [availableCoupons, subtotal]); // ✅ FIXED

  const activeCoupon = selectedCoupon || bestCoupon;

const discount = activeCoupon
  ? activeCoupon.type === "flat"
    ? activeCoupon.discount
    : subtotal * activeCoupon.discount
  : 0;

  const finalTotal = Math.max(0, subtotal - discount + delivery);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((prev) => ({
        ...prev,
        address: `Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude}`
      }));
    });
  };

  const handleEditAddress = (i) => {
    setForm(savedAddresses[i]);
    setEditIndex(i);
  };

  const handleDeleteAddress = (i) => {
    setSavedAddresses(savedAddresses.filter((_, index) => index !== i));
  };

  const handleSelectAddress = (addr) => {
    setForm(addr);
    setEditIndex(null);
  };

  // 🛒 ORDER
  const handleOrder = async () => {
  if (!form.name || !form.address) {
    alert("Fill details");
    return null;
  }

  try {
    const res = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ items, total: finalTotal })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Order failed ❌");
      return null;
    }

    setOrders((prev) => [...prev, data]);

    if (!location.state?.items) setCart([]);

    return data; // ✅ IMPORTANT

  } catch {
    alert("Order error ❌");
    return null;
  }
};

  const handleRazorpay = async () => {
  try {
    const res = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: finalTotal })
    });

    const order = await res.json();

    const options = {
      key: "rzp_test_SZQixfKqpFFiSI",
      amount: order.amount,
      currency: "INR",
      name: "Farmaro",
      order_id: order.id,
      handler: async function () {
  alert("Payment successful ✅");

  const orderData = await handleOrder(); // ✅ wait

  if (orderData) {
    navigate("/success", {
      state: {
        order: orderData,
        items,
        total: finalTotal
      }
    });
  }
} 
    };

    new window.Razorpay(options).open();
  } catch {
    alert("Payment failed ❌");
  }
};

  return (
    <div style={container}>
      <div style={left}>
        
        {/* ADDRESS */}
        <div style={card}>
          <h3>Delivery Address</h3>

          {savedAddresses.map((a, i) => (
            <div key={i} style={addressCard}>
              <div onClick={() => handleSelectAddress(a)}>
                <b>{a.name}</b>
                <p>{a.address}</p>
                <small>{a.phone}</small>
              </div>

              <div>
                <button onClick={() => handleEditAddress(i)}>Edit</button>
                <button onClick={() => handleDeleteAddress(i)}>Delete</button>
              </div>
            </div>
          ))}

          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={input}/>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={input}/>
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={input}/>
          <textarea name="address" value={form.address} onChange={handleChange} placeholder="Address" style={input}/>

          <button onClick={detectLocation} style={locationBtn}>
            Use Current Location
          </button>
        </div>

        {/* COUPONS */}
        <div style={card}>
          <h3>Available Coupons</h3>

          {availableCoupons.map((c) => {
  const isSelected = selectedCoupon?.code === c.code;

  return (
    <div
      key={c.code}
      onClick={() => setSelectedCoupon(c)}
      onMouseEnter={couponHover}
      onMouseLeave={(e) => couponLeave(e, isSelected)}
      style={{
        ...couponStyle,
        ...(isSelected && couponSelected)
      }}
    >
      {c.code} - {c.type === "flat"
        ? `₹${c.discount}`
        : `${c.discount * 100}%`} OFF
    </div>
  );
})}
  

          <h4 style={{ marginTop: "15px" }}>Not Applicable</h4>

          {notAvailableCoupons.map((c) => (
            <div key={c.code} style={couponDisabled}>
              {c.code} (Min ₹{c.minOrder})
            </div>
          ))}
        </div>

        {/* PAYMENT */}
        <div style={card}>
          <h3>Payment Method</h3>
          {["cod", "upi", "card"].map((p) => {
  const selected = payment === p;

  return (
    <div
      key={p}
      onClick={() => setPayment(p)}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#f5f5f5")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = selected ? "#4bd349a9" : "#fff")
      }
      style={{
        padding: "10px",
        marginTop: "8px",
        cursor: "pointer",
        border: selected ? "2px solid #ffffff00" : "1px solid #ddd",
        background: selected ? "#e3f2fd" : "#fff",
        borderRadius: "6px",
        transition: "0.2s"
      }}
    >
      {p.toUpperCase()}
    </div>
  );
})}
      </div>

      {/* RIGHT SUMMARY */}
      <div style={right}>
        <div style={card}>
          <h3>Price Details</h3>

          <p>Subtotal: ₹{subtotal}</p>

          {bestCoupon && (
            <p style={{ color: "green" }}>
              Coupon ({activeCoupon.code}): -₹{discount.toFixed(0)}
            </p>
          )}

          <p>Delivery: ₹{delivery}</p>

          <h2>Total: ₹{finalTotal.toFixed(0)}</h2>

          <button
  style={placeBtn}
  onClick={async () => {
  if (payment === "cod") {
    const orderData = await handleOrder();

    if (orderData) {
      navigate("/success", {
        state: {
          order: orderData,
          items,
          total: finalTotal
        }
      });
    }
  } else {
    handleRazorpay();
  }
}}
>
  {payment === "cod" ? "Place Order" : "Pay Now"}
</button>
        </div>
      </div>
    </div>
    </div>
   );
}


/* 🎨 MINIMAL UI */

const container = {
  width: "50%",
  display: "flex",
  alignItems: "flex-start", // 🔥 important
  gap: "20px",
  padding: "20px",
  background: "#f1f3f6"
};
const left = { flex: 2 };
const right= {
  position: "absolute",

  top: "80px",
  right: "20px",
  width: "45%",
  
  padding: "10px",
  borderRadius: "50%",
  
   // High enough to stay above everything else
};
const card = {
  background: "#fff",
  padding: "15px",
  borderRadius: "8px",
  marginBottom: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)" // 🔥 nice depth
};

const input = {
  width: "90%",
  padding: "10px",
  marginTop: "8px",
  border: "1px solid #e1e1e1",
  borderRadius: "20px"
};

const locationBtn = {
  width: "50%",
  padding: "10px",
  marginTop: "10px",
  background: "#2da928",
  color: "#fff",
  border: "1px solid #b5b5b6",
  cursor: "pointer",
  borderRadius: "20px",
  transition: "0.2s",
  alignSelf: "start",
  alignItems: "flex-start"
};


const addressCard = {

  padding: "10px",
  border: "1px solid #ddd",
  marginTop: "10px",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "space-between"
};



const couponDisabled = {
  padding: "10px",
  background: "#f5f5f5",
  color: "#999",
  marginTop: "5px"
};

// const payBox = {
//   padding: "10px",
//   marginTop: "8px",
//   cursor: "pointer"
// };

const placeBtn = {
  width: "50%",
  padding: "12px",
  background: "#fb641b",
  color: "#fff",
  border: "none",
  marginTop: "10px",
  cursor: "pointer",
  borderRadius: "20px",
  fontSize: "16px",
  transition: "0.2s",
  alignSelf: "start",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};



const couponStyle = {
  width: "50%",
  padding: "10px",
  marginTop: "6px",
  border: "1px solid #e1e1e1",
  borderRadius: "30px",
  cursor: "pointer",
  transition: "0.2s",
  fontSize: "14px"
};

const couponHover = (e) => {
  e.currentTarget.style.background = "#5eba5a";
};

const couponLeave = (e, isSelected) => {
  e.currentTarget.style.background = isSelected ? "#d1f0d1" : "#fff";
};

const couponSelected = {
  background: "#4ec34ed6",
  border: "2px solid #dfdddd"


};

export default Checkout;