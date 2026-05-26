import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./Store.css";

const CATEGORIES = ["All", "Action", "RPG", "Strategy", "Indie", "Horror", "Simulation"];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("/data/products.json")
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo cargar la información de los productos");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function setCategory(cat) {
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  const filtered = products.filter((p) => {
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="store">
      <div className="store-header">
        <h1 className="store-title">Store</h1>
        <div className="store-search-wrap">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="store-search"
          />
        </div>
      </div>

      <div className="store-layout">
        <aside className="store-sidebar">
          <p className="sidebar-label">Genres</p>
          <ul className="category-list">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <button
                  className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="store-main">
          {loading && (
            <div className="store-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          )}

          {error && (
            <div className="error-box">
              <p>⚠ {error}</p>
              <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <p className="results-count">{filtered.length} resultados</p>
              {filtered.length === 0 ? (
                <p className="empty-msg">No se encontraron juegos.</p>
              ) : (
                <div className="store-grid">
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
