import React from "react";
import ProductCard from "../components/ProductCard";

function Wishlist({ wishlist, setWishlist }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>My Wishlist ❤️</h2>

      {wishlist.length === 0 ? (
        <p>No items yet</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setWishlist={setWishlist}
              wishlist={wishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;