import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useLocation } from "react-router-dom";

function Products({ products, setCart, wishlist, setWishlist, search }) {

  const location = useLocation();

  // 🔎 Get category from URL
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get("category");

  const [category, setCategory] = useState(selectedCategory || "All");
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState(1000);

  // 🔄 Sync category with URL
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // 🧠 Filtering logic
  const filteredProducts = products
    .filter((p) => p.status === "approved")
    .filter((p) =>
      p.name.toLowerCase().includes((search || "").toLowerCase())
    )
    .filter((p) =>
      category === "All" ? true : p.category === category
    )
    .filter((p) => p.price <= priceRange)
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return 0;
    });

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>

      {/* 🟢 SIDEBAR */}
      <div
        style={{
          width: "240px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          height: "fit-content"
        }}
      >
        <h3 style={{ color: "#2e7d32" }}>Filters</h3>

        {/* Category */}
        <h4>Category</h4>
        {["All", "Vegetables", "Fruits", "Grains", "Seeds", "Fertilizers"].map((cat) => (
          <p
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              background: category === cat ? "#e8f5e9" : "transparent",
              color: category === cat ? "#2e7d32" : "#000",
              fontWeight: category === cat ? "bold" : "normal",
              backgroundColor: category === cat ? "#c8e6c9" : "transparent"
            }}
          >
            {cat}
          </p>
        ))}

        {/* Price */}
        <h4 style={{ marginTop: "15px" }}>Price</h4>
        <input
          type="range"
          min="0"
          max="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          style={{ width: "100%" , backgroundColor:"#00ff08",color:"#00ff08"}}
        />
        <p>Up to ₹{priceRange}</p>

        {/* Sort */}
        <h4>Sort</h4>
        <select
          onChange={(e) => setSort(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "0px",
            border: "1px solid #c8e6c9",
            select: {
              backgroundColor: "#c8e6c9",
              color: "#2e7d32"
            }
          }}
        >
          <option value="default">Default</option>
          <option value="low">Price Low → High</option>
          <option value="high">Price High → Low</option>
        </select>
      </div>

      {/* 🛍️ PRODUCTS GRID */}
      <div style={{ flex: 1 }}>

        <h2 style={{ marginBottom: "15px", color: "#2e7d32" }}>
          {category === "All" ? "All Products" : category}
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start"
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          ))}
        </div>

        {/* ❌ EMPTY STATE */}
        {filteredProducts.length === 0 && (
          <p style={{ marginTop: "20px" }}>
            No products found 😕
          </p>
        )}
      </div>

    </div>
  );
}

export default Products;