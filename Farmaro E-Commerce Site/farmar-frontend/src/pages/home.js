import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

function Home({ products, setCart, wishlist, setWishlist }) {
  const navigate = useNavigate();

  // 🎞️ Banner images
  const banners = [
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
    "https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAzL3Jhd3BpeGVsb2ZmaWNlNV93aWRlX2FuZ2xlX3Bob3RvZ3JhcGh5X3JlYWxpc3RpY19zaG90X3RoYWlfZmFybV81MjU3Y2U3YS05ZmUzLTQ4NzgtYmE1Ny02ZGNjNDAzZWY2YzVfMS5qcGc.jpg",
    "https://wallpaperaccess.com/full/3495493.jpg"
  ];

  const [index, setIndex] = useState(0);

  // ✅ Approved products
  const approvedProducts =
    products?.filter((p) => p.status === "approved") || [];

  // 🎞️ Auto banner slider
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // 🟢 Categories
  const categories = [
    { name: "Fruits", image: "https://png.pngtree.com/background/20230411/original/pngtree-food-fresh-fruit-realistic-picture-image_2390265.jpg" },
    { name: "Vegetables", image: "https://wallpaperaccess.com/full/1537336.jpg" },
    { name: "Grains", image: "https://img.lovepik.com/photo/20211208/small/lovepik-whole-grains-picture_501617012.jpg" },
    { name: "Seeds", image: "https://watv.org/wp-content/uploads/2023/05/thum_sowing_seeds.jpg" },
    { name: "Fertilizers", image: "https://www.fertilizerseurope.com/wp-content/uploads/2019/08/iStock-606230424-1024x643.jpg" },
    { name: "Pesticides", image: "https://static.vecteezy.com/system/resources/previews/010/508/343/large_2x/old-farmers-spray-fertilizer-or-chemical-pesticides-in-the-rice-fields-chemical-fertilizers-free-photo.jpg" },
    { name: "Tools", image: "https://tse3.mm.bing.net/th/id/OIP.r9EoCV7DSqNMekAs7IMTWwHaFj?pid=Api&P=0&h=180" },
    { name: "Dairy", image: "https://images5.alphacoders.com/659/thumb-1920-659172.jpg" },
    { name: "Flowers", image: "https://tse1.mm.bing.net/th/id/OIP.A3JisJ8N8NQFOhjah1bbhQHaEY?pid=Api&P=0&h=180" }
  ];

  const offerProducts = approvedProducts.filter(
    (p) => p.offer && p.offer > 0
  );

  return (
    <div style={{ padding: "20px" }}>

      {/* 🎞️ BANNER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "260px",
          marginBottom: "30px",
          overflow: "hidden",
          borderRadius: "15px"
        }}
      >
        <img
          src={banners[index]}
          alt="banner"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.35)"
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "5%",
            transform: "translateY(-50%)",
            color: "#fff",
            zIndex: 2
          }}
        >
          <h1 style={{ margin: 0 }}>Fresh From Farmers 🌾</h1>
          <p style={{ margin: "10px 0" }}>
            Organic & Trusted Products
          </p>

          <button
            className="btn-primary"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* 🟢 CATEGORY ZONE */}
      <h2 style={{ marginBottom: "10px" }}>Categories</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.name}
            style={{
              borderRadius: "16px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              background: "rgba(94, 205, 46, 0.09)",
              backdropFilter: "blur(10px)",
              transition: "0.3s"
            }}
            onClick={() =>
              navigate(`/products?category=${cat.name.toLowerCase()}`)
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.querySelector("img").style.transform = "scale(1.15)";
              e.currentTarget.querySelector("h4").style.color = "#2e7d32";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.querySelector("img").style.transform = "scale(1)";
              e.currentTarget.querySelector("h4").style.color = "#000";
            }}
          >
            <div style={{ overflow: "hidden" }}>
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  transition: "0.4s ease"
                }}
              />
            </div>

            <div style={{ padding: "10px", textAlign: "center" }}>
              <h4 style={{ margin: 0, transition: "0.3s" }}>
                {cat.name}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 OFFER ZONE */}
      <h2 style={{ marginBottom: "10px" }}>
        Today's Offers ⚡
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          overflowX: "auto",
          paddingBottom: "10px",
          marginBottom: "30px"
        }}
      >
        {offerProducts.length === 0 ? (
          <p>No offers available right now 😕</p>
        ) : (
          offerProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              setCart={setCart}
              wishlist={wishlist}
              setWishlist={setWishlist}
            />
          ))
        )}
      </div>

      {/* 🛍️ FEATURED PRODUCTS */}
      <h2 style={{ marginBottom: "15px" }}>
        Featured Products
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {approvedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            setCart={setCart}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        ))}
      </div>

    </div>
  );
}

export default Home;