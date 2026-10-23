import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ user, setUser, cart, search, setSearch }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSeller = user?.role === "seller";

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      role: "",
      name: "",
      email: ""
    });
    setOpen(false);
    navigate("/");
  };

  return (
    <nav style={navStyle}>
     
      <h2
        style={{ margin: 0, cursor: "pointer" }}
        onClick={() => navigate(isSeller ? "/seller" : "/")}
      >
        Farmaro
      </h2>

      
      {!isSeller && (
        <div style={{ position: "relative", width: "40%" }}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              navigate("/products");
            }}
            placeholder="Search products..."
            style={searchStyle}
          />
        </div>
      )}

      
      <div style={linksContainer}>

       
        {isSeller ? (
          <>
            <Link
              to="/seller"
              style={{
                ...linkStyle,
                ...(location.pathname === "/seller" ? activeStyle : {})
              }}
            >
              Home
            </Link>

            <Link
              to="/seller/my-products"
              style={{
                ...linkStyle,
                ...(location.pathname === "/seller/my-products"
                  ? activeStyle
                  : {})
              }}
            >
              My Products
            </Link>

            <Link
              to="/seller/orders"
              style={{
                ...linkStyle,
                ...(location.pathname === "/seller/orders"
                  ? activeStyle
                  : {})
              }}
            >
              Orders
            </Link>
          </>
        ) : (
          <>
            
            <Link
              to="/"
              style={{
                ...linkStyle,
                ...(location.pathname === "/" ? activeStyle : {})
              }}
            >
              Home
            </Link>

            <Link
              to="/products"
              style={{
                ...linkStyle,
                ...(location.pathname === "/products"
                  ? activeStyle
                  : {})
              }}
            >
              Products
            </Link>

            <Link
              to="/wishlist"
              style={{
                ...linkStyle,
                ...(location.pathname === "/wishlist"
                  ? activeStyle
                  : {})
              }}
            >
              ❤️
            </Link>

            <div style={{ position: "relative" }}>
              <Link
                to="/cart"
                style={{
                  ...linkStyle,
                  ...(location.pathname === "/cart"
                    ? activeStyle
                    : {})
                }}
              >
                🛒
              </Link>

              {cart.length > 0 && (
                <span style={cartBadge}>{cart.length}</span>
              )}
            </div>
          </>
        )}

        {/* 👤 PROFILE */}
        {!user?.isLoggedIn ? (
          <Link
            to="/login"
            style={{
              ...linkStyle,
              ...(location.pathname === "/login" ? activeStyle : {})
            }}
          >
            Login
          </Link>
        ) : (
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setOpen(!open)}
              style={{ cursor: "pointer", fontSize: "18px" }}
            >
              👤
            </span>

            {open && (
              <div style={dropdownStyle}>
                <p><b>{user.name || "User"}</b></p>
                <p style={{ fontSize: "12px", color: "#777" }}>
                  {user.email || "user@email.com"}
                </p>

                <hr />

                {/* 🔁 ROLE BASED PROFILE LINK */}
                <Link
                  to={isSeller ? "/seller/orders" : "/orders"}
                  style={{ textDecoration: "none" }}
                >
                  {isSeller ? "Seller Orders" : "My Orders"}
                </Link>

                <br /><br />

                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

/* 🎨 STYLES */

const navStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 20px",
  background: "#2e7d32",
  color: "#fff",
  boxShadow: "0 2px 10px rgba(0,0,0,0.15)"
};

const searchStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  outline: "none"
};

const linksContainer = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const linkStyle = {
  textDecoration: "none",
  color: "#ffffff",
  fontWeight: "400",
  padding: "6px 10px",
  borderRadius: "6px",
  transition: "0.2s"
};

const activeStyle = {
  background: "#4ba036",
  color: "#ffffff"
};

const cartBadge = {
  position: "absolute",
  top: "-8px",
  right: "-10px",
  background: "red",
  color: "#ffffff",
  borderRadius: "50%",
  padding: "2px 6px",
  fontSize: "12px"
};

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "35px",
  background: "#fff",
  color: "#000",
  padding: "12px",
  borderRadius: "10px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
  width: "180px"
};

const logoutBtn = {
  width: "100%",
  background: "#e53935",
  color: "#fff",
  border: "none",
  padding: "8px",
  borderRadius: "6px",
  cursor: "pointer"
};

export default Navbar;