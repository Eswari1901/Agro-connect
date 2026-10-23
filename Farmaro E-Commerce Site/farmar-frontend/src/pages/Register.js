import React, { useState } from "react";

function Register() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  const res = await fetch("http://localhost:5000/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role
    })
  });

  const data = await res.json();

  if (res.ok) {
    alert("Registered successfully ✅");
  } else {
    alert(data.msg);
  }
};
  

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>

      {/* Role Selection */}
      <div>
        <button onClick={() => setRole("customer")}>Customer</button>
        <button onClick={() => setRole("seller")}>Seller</button>
      </div>

      <h3>{role === "customer" ? "Customer Register" : "Seller Register"}</h3>

      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", width: "300px" }}>
        <input
  type="text"
  placeholder="Name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  style={{ margin: "5px" }}
/>

<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  style={{ margin: "5px" }}
/>

<input
  type="password"
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  style={{ margin: "5px" }}
/>

        {/* Extra for seller */}
        {role === "seller" && (
          <input type="text" placeholder="Farm Name" style={{ margin: "5px" }} />
        )}

        <button type="submit" style={{ margin: "10px" }}>Register</button>
      </form>
    </div>
  );
}

export default Register;