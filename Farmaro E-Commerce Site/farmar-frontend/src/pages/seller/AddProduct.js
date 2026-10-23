import React, { useState } from "react";

function AddProduct({ setProducts, user }) {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    offer: "",
    category: "",
    images: [],
    video: ""
  });

  const offer=Number(product.offer) || 0;

  const [previewImages, setPreviewImages] = useState([]);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // ✅ IMAGE UPLOAD + COMPRESS
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 3 || files.length > 4) {
      alert("Upload minimum 3 and maximum 4 images");
      return;
    }

    const imagePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;

          img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            const MAX_WIDTH = 300;
            const scale = MAX_WIDTH / img.width;

            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const compressed = canvas.toDataURL("image/jpeg", 0.7);
            resolve(compressed);
          };
        };

        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then((images) => {
      setProduct((prev) => ({ ...prev, images }));
      setPreviewImages(images);
    });
  };

  // ❌ REMOVE IMAGE
  const removeImage = (index) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    setProduct((prev) => ({ ...prev, images: updated }));
  };

  // ✅ SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔒 VALIDATION
    if (!product.name || !product.price || !product.category) {
      alert("Please fill all fields");
      return;
    }

    if (isNaN(product.price)) {
      alert("Price must be a number");
      return;
    }

    if (Number(product.price) <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    if (product.images.length < 3) {
      alert("Please upload at least 3 images");
      return;
    }

    const priceNumber = Number(product.price);

    const newProduct = {
      id: Date.now(), // ✅ UNIQUE ID
      name: product.name,
      price: priceNumber, // ✅ SAFE NUMBER
      oldPrice: offer ? Number(product.price) : null,
      offer,
      finalPrice: offer
       ? Math.round(product.price - (product.price * offer) / 100)
       : Number(product.price),
      description: product.description || "No description provided.",
      category: product.category,
      images: product.images,
      video: product.video,
      sellerId: user._id ,
      sellerName: user.name,
      status: "pending",
      reviews: []
    };

    setProducts((prev) => [...prev, newProduct]);

    alert("Product submitted for approval ✅");

    // 🔄 RESET
    setProduct({
      name: "",
      price: "",
      category: "",
      images: [],
      video: ""
    });

    setPreviewImages([]);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        {/* NAME */}
        <input
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          style={input}
        />

        {/* PRICE */}
        <input
          name="price"
          type="number" // ✅ IMPORTANT
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          style={input}
        />
        {/* OFFER */}
        <input
  name="offer"
  placeholder="Offer % (optional)"
  value={product.offer}
  onChange={handleChange}
/>

        {/* CATEGORY */}
        <input
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          style={input}
        />
        {/* {description} */}

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          style={input}
        />

        {/* IMAGES */}
        <h4>Upload Product Images (3–4)</h4>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />

        {/* PREVIEW */}
        <div style={{ display: "flex", marginTop: "10px", gap: "10px" }}>
          {previewImages.map((img, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={img}
                alt=""
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px"
                }}
              />
              <button
                type="button" // ✅ FIXED BUG
                onClick={() => removeImage(index)}
                style={removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* VIDEO */}
        <input
          name="video"
          placeholder="YouTube link"
          value={product.video}
          onChange={handleChange}
          style={input}
        />

        {/* SUBMIT */}
        <button type="submit" style={submitBtn}>
          Submit Product
        </button>
      </form>
    </div>
  );
}

// 🎨 STYLES
const input = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd"
};

const submitBtn = {
  marginTop: "15px",
  width: "100%",
  padding: "12px",
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer"
};

const removeBtn = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "red",
  color: "#fff",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer"
};

export default AddProduct;