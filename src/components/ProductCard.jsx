import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((item) => item.id === product.id);

  return (
    <div className="product-card">
      <Link to={`/store/${product.id}`} className="card-image-link">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/320/180`}
          alt={product.name}
          className="card-image"
        />
        <div className="card-overlay">
          <span className="card-tag">{product.category || "Action"}</span>
        </div>
      </Link>
      <div className="card-body">
        <Link to={`/store/${product.id}`} className="card-title">{product.name}</Link>
        <p className="card-description">{product.description?.slice(0, 60)}...</p>
        <div className="card-footer">
          <span className="card-price">${Number(product.price).toFixed(2)}</span>
          <button
            className={`card-btn ${inCart ? "in-cart" : ""}`}
            onClick={() => addToCart(product)}
            disabled={inCart}
          >
            {inCart ? "✓ In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
