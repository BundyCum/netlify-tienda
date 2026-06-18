import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inCart = cart.some((item) => item.id === product?.id);

  useEffect(() => {
    setLoading(true);
    fetch("/data/products.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar los productos");
        return res.json();
      })
      .then((data) => {
        const found = data.find((p) => p.id === id);
        if (!found) throw new Error("Producto no encontrado");
        setProduct(found);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="detail-page">
        <div className="detail-skeleton" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-page">
        <div className="detail-error">
          <p>⚠ {error || "Producto no encontrado"}</p>
          <button onClick={() => navigate("/store")}>← Volver a la tienda</button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Volver</button>

      <div className="detail-grid">
        <div className="detail-media">
          <img
            src={product.image}
            alt={product.name}
            className="detail-img"
          />
          <div className="detail-screenshots">
            {(product.screenshots || []).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Screenshot ${i + 1}`}
                className="screenshot"
              />
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-tag">{product.category || "Action"}</span>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-desc">{product.description}</p>

          <div className="detail-meta">
            <div className="meta-row">
              <span className="meta-label">Developer</span>
              <span className="meta-value">TETRUX Studios</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Platform</span>
              <span className="meta-value">Windows, macOS</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Stock</span>
              <span className="meta-value">{product.stock} units</span>
            </div>
          </div>

          <div className="detail-buy">
            <span className="detail-price">${Number(product.price).toFixed(2)}</span>
            <button
              className={`buy-btn ${inCart ? "in-cart" : ""}`}
              onClick={() => addToCart(product)}
              disabled={inCart}
            >
              {inCart ? "✓ En el Carrito" : "Agregar al Carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}