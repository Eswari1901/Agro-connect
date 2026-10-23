import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";

function ProductDetails({ products, setCart, setProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const product = products.find((p) => p.id === Number(id));

  const [index, setIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortType, setSortType] = useState("latest");

  if (!product) return <h2>Product not found</h2>;

  // 🎞️ Media
  const media = [
    ...(product.images || []),
    product.video || null
  ].filter(Boolean);

  // ⭐ Avg rating
  const avgRating =
    product.reviews?.length > 0
      ? (
          product.reviews.reduce((a, r) => a + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : 0;

  // 🔁 Carousel controls
  const next = () => setIndex((prev) => (prev + 1) % media.length);
  const prev = () =>
    setIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  // 🛒 Cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    setCart(product);
    addToast("Added to cart ✅");
  };

  // ✍️ Add review
  const handleReview = () => {
    if (!comment) return alert("Write something!");

    const newReview = {
      id: Date.now(),
      rating,
      comment,
      user: "User",
      likes: 0
    };

    const updated = products.map((p) =>
      p.id === product.id
        ? { ...p, reviews: [...(p.reviews || []), newReview] }
        : p
    );

    setProducts(updated);
    setComment("");
  };

  // 👍 Like
  const handleLike = (rid) => {
    const updated = products.map((p) => {
      if (p.id === product.id) {
        return {
          ...p,
          reviews: p.reviews.map((r) =>
            r.id === rid ? { ...r, likes: (r.likes || 0) + 1 } : r
          )
        };
      }
      return p;
    });

    setProducts(updated);
  };

  // 🔽 Sort reviews
  const sortedReviews = [...(product.reviews || [])].filter((r) => {
  if (["5", "4", "3"].includes(sortType)) {
    return r.rating === Number(sortType);
  }
  return true;
}).sort((a, b) => {
  if (sortType === "latest") return b.id - a.id;
  if (sortType === "helpful") return (b.likes || 0) - (a.likes || 0);
  return 0;
});;

  // 🛍️ Suggested
  const suggested = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        p.status === "approved"
    )
    .slice(0, 4);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      {/* BACK */}
      <button onClick={() => navigate(-1)}>← Back</button>

      {/* 🎞️ CAROUSEL */}
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        {/* LEFT */}
        {media.length > 1 && (
          <img
            src={media[(index - 1 + media.length) % media.length]}
            alt=""
            style={{ width: "100px", opacity: 0.4, borderRadius: "10px" }}
          />
        )}

        {/* MAIN */}
        <div style={{ flex: 1, margin: "0 10px", position: "relative" }}>
          {media[index]?.includes("youtube") ? (
            <iframe
              width="100%"
              height="400px"
              src={media[index].replace("watch?v=", "embed/")}
              title="video"
            />
          ) : (
            <img
              src={media[index]}
              alt=""
              style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "12px" }}
            />
          )}

          <div onClick={prev} style={arrowLeft}>‹</div>
          <div onClick={next} style={arrowRight}>›</div>
        </div>

        {/* RIGHT */}
        {media.length > 1 && (
          <img
            src={media[(index + 1) % media.length]}
            alt=""
            style={{ width: "100px", opacity: 0.4, borderRadius: "10px" }}
          />
        )}
      </div>

      {/* THUMBNAILS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
        {media.map((item, i) => (
          <div key={i} onClick={() => setIndex(i)}>
            {item.includes("youtube") ? (
              <div style={thumbVideo}>▶</div>
            ) : (
              <img src={item} alt="" style={thumb(index === i)} />
            )}
          </div>
        ))}
      </div>

      {/* DETAILS */}
      <h2>{product.name}</h2>
      <p style={{ color: "#ffc107" }}>
        {"★".repeat(Math.round(avgRating))}
        {"☆".repeat(5 - Math.round(avgRating))} ({avgRating})
      </p>

      <h3 style={{ color: "#2e7d32" }}>₹{product.price}</h3>
      <p>{product.description || "Fresh organic farm product."}</p>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <button onClick={handleAddToCart} className="btn-outline">
          Add to Cart
        </button>
        <button className="btn-primary" onClick={() => navigate("/checkout")}>
          Buy Now
        </button>
      </div>

      {/* ✍️ REVIEW BOX */}
      <div style={reviewBox}>
        <h3>Write a Review</h3>

        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: star <= (hoverRating || rating) ? "#ffc107" : "#ccc"
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ width: "100%", marginTop: "10px" }}
        />

        <button onClick={handleReview} className="btn-primary">
          Submit Review
        </button>
      </div>

      {/* SORT */}
    <div style={{ marginTop: "20px" }}>
  <h3>Customer Reviews</h3>

  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
    {[
      { label: "Latest", value: "latest" },
      { label: "5★", value: "5" },
      { label: "4★", value: "4" },
      { label: "3★", value: "3" },
      { label: "Helpful", value: "helpful" }
    ].map((item) => (
      <button
        key={item.value}
        onClick={() => setSortType(item.value)}
        style={{
          padding: "6px 12px",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          background:
            sortType === item.value ? "#2e7d32" : "#eee",
          color:
            sortType === item.value ? "#fff" : "#000"
        }}
      >
        {item.label}
      </button>
    ))}
  </div>
</div>

      {/* REVIEWS */}
      {sortedReviews.length > 0 ? (
        sortedReviews.map((r) => (
          <div key={r.id} style={reviewCard}>
            <b>{r.user}</b>
            <p style={{ color: "#ffc107" }}>
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </p>
            <p>{r.comment}</p>
            <button onClick={() => handleLike(r.id)}>
              👍 Helpful ({r.likes || 0})
            </button>
          </div>
        ))
      ) : (
        <p>No reviews yet</p>
      )}

      {/* SUGGESTED */}
      <h3 style={{ marginTop: "30px" }}>Related Products</h3>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {suggested.map((p) => (
          <ProductCard key={p.id} product={p} setCart={setCart} />
        ))}
      </div>
    </div>
  );
}

// styles
const arrowLeft = { position: "absolute", left: "10px", top: "50%", color: "#fff", cursor: "pointer", fontSize: "30px" };
const arrowRight = { position: "absolute", right: "10px", top: "50%", color: "#fff", cursor: "pointer", fontSize: "30px" };
const reviewBox = { background: "#fff", padding: "20px", borderRadius: "12px", marginTop: "30px" };
const reviewCard = { background: "#fff", padding: "15px", marginTop: "10px", borderRadius: "10px" };
const thumb = (active) => ({
  width: "80px",
  height: "60px",
  objectFit: "cover",
  border: active ? "2px solid green" : "none",
  borderRadius: "6px"
});
const thumbVideo = { width: "80px", height: "60px", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" };

export default ProductDetails;