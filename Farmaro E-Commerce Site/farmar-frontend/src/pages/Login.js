import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [isLogin, setIsLogin] = useState(true);

  // ✅ SINGLE STATE (FIXES BUG)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    farmName: ""
  });

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 SUBMIT
  const handleSubmit = async () => {
    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = {
        email: form.email,
        password: form.password,
        role
      };

      // ✅ ADD EXTRA FIELDS ONLY FOR REGISTER
      if (!isLogin) {
        payload.name = form.name;
        if (role === "seller") {
          payload.farmName = form.farmName;
        }
      }

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error ❌");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", data.token);

      setUser({
        isLoggedIn: true,
        role: data.role,
        name: data.name,
        email: data.email
      });

      navigate(role === "seller" ? "/seller" : "/");

    } catch (err) {
      console.log(err);
      alert("Server error ❌");
    }
  };

  return (
    <div className="auth-container">

      {/* LEFT */}
      <div className="auth-left">
        <div className="form-box">

          {/* ROLE */}
          <div className="role-toggle">
            <button
              className={role === "customer" ? "active" : ""}
              onClick={() => setRole("customer")}
            >
              Customer
            </button>

            <button
              className={role === "seller" ? "active" : ""}
              onClick={() => setRole("seller")}
            >
              Seller
            </button>
          </div>

          <h2>{isLogin ? "Login" : "Register"}</h2>

          {/* NAME */}
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
            />
          )}

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          {/* FARM NAME (SELLER ONLY) */}
          {!isLogin && role === "seller" && (
            <input
              type="text"
              name="farmName"
              placeholder="Farm Name"
              value={form.farmName}
              onChange={handleChange}
            />
          )}

          {/* BUTTON */}
          <button className="auth-btn" onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>

          {/* SWITCH */}
          <p>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsLogin(false)}>Register</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span onClick={() => setIsLogin(true)}>Login</span>
              </>
            )}
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <h2>🌾 Fresh From Farms</h2>
        <p>Get daily fresh vegetables directly from farmers</p>
      </div>

    </div>
  );
}

export default Login;