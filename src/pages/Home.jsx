import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setFeatured(Array.isArray(data) ? data.slice(0, 4) : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-content">
            <p className="hero-eyebrow">New Release</p>
            <h1 className="hero-title">Discover Your<br />Next Adventure</h1>
            <p className="hero-sub">
              Thousands of games. Endless worlds. Your library awaits.
            </p>
            <div className="hero-cta">
              <Link to="/store" className="btn-hero-primary">Browse Store</Link>
              <Link to="/store" className="btn-hero-ghost">View all →</Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow" />
            <img
              src="img/Tetrux_foto.png"
              alt="Featured game"
              className="hero-img"
            />
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured & Recommended</h2>
          <Link to="/store" className="section-link">See all →</Link>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="categories-section">
        <h2 className="section-title">Browse by Genre</h2>
        <div className="categories-grid">
          {["Action", "RPG", "Strategy", "Indie", "Horror", "Simulation"].map((cat) => (
            <Link key={cat} to={`/store?category=${cat}`} className="category-chip">
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
