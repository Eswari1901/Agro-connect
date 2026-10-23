import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
// import SellerRoute from "./components/SellerRoute";

// Pages
import Home from "./pages/home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Chatbot from "./pages/Chatbot";
import Wishlist from "./pages/Wishlist";

// Seller Pages
import Dashboard from "./pages/seller/Dashboard";
import AddProduct from "./pages/seller/AddProduct";
import MyProducts from "./pages/seller/MyProducts";
import SellerOrders from "./pages/seller/SellerOrders";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Sellers from "./pages/admin/Sellers";
import AdminProducts from "./pages/admin/AdminProducts";

// Toast
import { ToastProvider } from "./context/ToastContext";

function App() {

  const location = useLocation();

  // 🔥 HIDE NAVBAR FOR ADMIN
  const hideNavbar = location.pathname.startsWith("/admin");

  // 👤 User
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: ""
  });

  // 🛒 Cart
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    if (!product) return;

    const safeProduct = {
      id: product.id || Date.now(),
      name: product.name || "No Name",
      price: Number(product.price) || 0,
      images: Array.isArray(product.images) ? product.images : [],
      description: product.description || "",
    };

    setCart((prev) => {
      const exists = prev.find((p) => p.id === safeProduct.id);

      if (exists) {
        return prev.map((p) =>
          p.id === safeProduct.id
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      }

      return [...prev, { ...safeProduct, qty: 1 }];
    });
  };

  // 📦 Products
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // ❤️ Wishlist
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 👨‍🌾 Sellers
  const [sellers, setSellers] = useState([
    { id: 1, name: "Farmer A", status: "pending" },
    { id: 2, name: "Farmer B", status: "pending" }
  ]);

  // 📦 Orders
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  // 🔎 Search
  const [search, setSearch] = useState("");

  return (
    <ToastProvider>

      {/* ✅ Navbar hidden for admin */}
      {!hideNavbar && (
        <Navbar
          user={user}
          setUser={setUser}
          cart={cart}
          search={search}
          setSearch={setSearch}
        />
      )}

      <Chatbot products={products} />

      <div style={{ padding: "10px", background: "#f5f5f5", minHeight: "100vh" }}>
        <Routes>

          {/* Home */}
          <Route path="/" element={
            <Home
              products={products}
              setCart={handleAddToCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          } />

          {/* Products */}
          <Route path="/products" element={
            <Products
              products={products}
              setCart={handleAddToCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
              search={search}
            />
          } />

          {/* Cart */}
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />

          {/* Product Details */}
          <Route path="/product/:id" element={
            <ProductDetails
              products={products}
              setProducts={setProducts}
              setCart={handleAddToCart}
              user={user}
            />
          } />

          {/* Checkout */}
          <Route path="/checkout" element={
            <Checkout cart={cart} setCart={setCart} setOrders={setOrders} />
          } />

          {/* Orders */}
          <Route path="/orders" element={
            <Orders orders={orders} setOrders={setOrders} />
          } />

          {/* Success */}
          <Route path="/success" element={<Success />} />

          {/* Auth */}
          <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={
            <Wishlist wishlist={wishlist} setWishlist={setWishlist} />
          } />

          {/* Seller */}
          <Route path="/seller" element={<Dashboard products={products} orders={orders} user={user} />} />
          <Route path="/seller/add-product" element={
            <AddProduct products={products} setProducts={setProducts} user={user} />
          } />
          <Route path="/seller/my-products" element={<MyProducts products={products} />} />
          <Route path="/seller/orders" element={
            <SellerOrders orders={orders} products={products} setOrders={setOrders} user={user} />
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <AdminDashboard products={products} sellers={sellers} user={user} orders={orders} />
          } />
          <Route path="/admin/sellers" element={
            <Sellers sellers={sellers} setSellers={setSellers} />
          } />
          <Route path="/admin/products" element={
            <AdminProducts products={products} setProducts={setProducts} />
          } />

        </Routes>
      </div>

    </ToastProvider>
  );
}

export default App;