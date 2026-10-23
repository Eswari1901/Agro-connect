import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function ProductCard({ product, setCart, wishlist, setWishlist }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // ✅ SAFE
  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
  const safeSetWishlist = setWishlist || (() => {});

  const isLiked = safeWishlist.some(
    (item) => item.id === product.id
  );

  const [hover, setHover] = React.useState(false);

  // ⭐ Rating
  const avgRating =
    product.reviews?.length > 0
      ? (
          product.reviews.reduce((a, r) => a + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  // ❤️ Wishlist toggle
  const toggleWishlist = (e) => {
    e.stopPropagation();

    let updated;

    if (isLiked) {
      updated = safeWishlist.filter(
        (item) => item.id !== product.id
      );
    } else {
      updated = [...safeWishlist, product];
    }

    safeSetWishlist(updated);
  };

  // 🛒 Cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    setCart(product);
    addToast("Added to cart ✅");
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative", // ✅ IMPORTANT FIX
        background: "#ecf8f0",
        borderRadius: "12px",
        padding: "12px",
        width: "220px",
        margin: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
      }}
    >
      {/* ❤️ Wishlist */}
      {(hover || isLiked) && (
        <div
          onClick={toggleWishlist}
          style={{
            position: "absolute",
            top: "10px",
          right: "10px",
          cursor: "pointer",
          fontSize: "18px",
          zIndex: 2,
          background:"#fff",
          padding:"5px",
          boxShadow:"0 2px 6px rgba(0,0,0,0.2)",
          borderRadius:"50%"
        }}
      >
        {isLiked ? "❤️" : "🤍"}
      </div>
      )}

      {/* 🏷️ Discount Badge */}
      {product.offer > 0 && (
  <div
    style={{
      position: "absolute",
      top: "10px",
      left: "10px",
      background: "#ff5722",
      color: "#fff",
      padding: "4px 8px",
      borderRadius: "5px",
      fontSize: "12px"
    }}
  >
    {product.offer}% OFF
  </div>
)}
         

      {/* 🖼️ Image */}
      <img
        src={product.images?.[0] || product.image}
        alt={product.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "10px"
        }}
      />

      {/* 📦 Name */}
      <h4>{product.name}</h4>

      {/* ⭐ Rating */}
      <p style={{ color: "#ffc107" }}>
        {"★".repeat(Math.round(avgRating))}
        {"☆".repeat(5 - Math.round(avgRating))}
      </p>

      {/* 💰 Price */}
      <p>
         <b>₹{product.finalPrice || product.price}</b>{" "}

  {product.offer > 0 && (
    <span
      style={{
        textDecoration: "line-through",
        color: "#999",
        marginLeft: "5px"
      }}
    >
      ₹{product.oldPrice}
    </span>
  )}
</p>

      {/* 🛒 Button */}
      <button className="btn-outline" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;