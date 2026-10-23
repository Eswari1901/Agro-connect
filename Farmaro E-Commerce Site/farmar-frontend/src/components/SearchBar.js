import React from "react";

function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        width: "60%",
        margin: "20px",
        borderRadius: "5px",
        border: "1px solid #ccc"
      }}
    />
  );
}

export default SearchBar;