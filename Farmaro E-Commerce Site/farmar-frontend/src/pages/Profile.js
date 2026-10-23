import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function Profile({ user, setUser }) {
  const [role, setRole] = useState("customer");

const navigate = useNavigate();

const handleLogin = () => {
  setUser({
    isLoggedIn: true,
    role: role});

  if (role === "seller") {
    navigate("/seller");
  }
};
  return (
  <div>
  <button onClick={() => setRole("customer")}>Customer</button>
  <button onClick={() => setRole("seller")}>Seller</button>
  <button onClick={handleLogin}>Login</button>
  </div>



  )
}

export default Profile;