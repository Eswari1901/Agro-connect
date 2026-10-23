import ProductCard from "../../components/ProductCard";

function MyProducts({ products, setCart, wishlist, setWishlist, user }) {

  const sellerProducts = products.filter(
    (p) => p.sellerId === user?.id
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Products</h2>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {sellerProducts.map((product) => (
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

export default MyProducts;