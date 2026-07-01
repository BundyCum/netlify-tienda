import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { Container, Row, Col, Spinner, Alert, Pagination } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { FiSearch } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import styled from "styled-components";
import "./Store.css";

const CATEGORIES = ["All", "Action", "RPG", "Strategy", "Indie", "Horror", "Simulation"];
const PAGE_SIZE = 6;

const PageTitle = styled.h1`
  color: #e8e0ff; font-size: 1.6rem; font-weight: 800;
  margin: 0; letter-spacing: -.02em;
`;
const SearchWrap = styled.div`
  position: relative;
  input {
    background: #13121f; border: 1px solid rgba(130,80,255,.2);
    color: #e8e0ff; font-size: .875rem; padding: .5rem 1rem .5rem 2.2rem;
    border-radius: 5px; width: 240px; outline: none; transition: border-color .2s;
    &::placeholder { color: #4a4560; }
    &:focus { border-color: #8250ff; }
  }
  svg { position: absolute; left: .65rem; top: 50%; transform: translateY(-50%); color: #4a4560; }
`;
const CatBtn = styled.button`
  width: 100%; text-align: left; background: transparent; border: none;
  color: ${p => p.$active ? "#c4b0ff" : "#7a7290"};
  font-size: .875rem; padding: .45rem .75rem; border-radius: 4px; cursor: pointer;
  background: ${p => p.$active ? "rgba(130,80,255,.15)" : "transparent"};
  font-weight: ${p => p.$active ? "600" : "400"};
  transition: all .15s;
  &:hover { background: rgba(130,80,255,.08); color: #c4b0ff; }
`;
const SideLabel = styled.p`color:#4a4560;font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin:0 0 .5rem;`;
const ResultsCount = styled.p`color:#4a4560;font-size:.78rem;margin:0 0 1rem;`;
const BSPagination = styled(Pagination)`
  margin-top: 1.5rem;
  .page-item .page-link {
    background: #13121f; border-color: rgba(130,80,255,.2); color: #c4b0ff;
    &:hover { background: rgba(130,80,255,.15); color: #e8e0ff; }
  }
  .page-item.active .page-link { background: #8250ff; border-color: #8250ff; color: #fff; }
  .page-item.disabled .page-link { background: #0a0917; color: #4a4560; border-color: rgba(130,80,255,.1); }
`;

export default function Store() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";

  useEffect(() => {
    setLoading(true);
    setError(null);
    get(ref(db, "products"))
      .then((snap) => {
        if (snap.exists()) {
          const arr = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
          setProducts(arr);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar los productos.");
        setLoading(false);
      });
  }, []);

  useEffect(() => { setPage(1); }, [search, activeCategory]);

  function setCategory(cat) {
    cat === "All" ? setSearchParams({}) : setSearchParams({ category: cat });
  }

  const filtered = products.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Helmet>
        <title>Tienda · TETRUX</title>
        <meta name="description" content="Explorá el catálogo completo de videojuegos en TETRUX." />
      </Helmet>
      <Container style={{ maxWidth: 1100, padding: "2rem 1rem" }}>
        <div className="store-header">
          <PageTitle>Store</PageTitle>
          <SearchWrap>
            <FiSearch />
            <input type="text" placeholder="Search games..." value={search} onChange={e => setSearch(e.target.value)} />
          </SearchWrap>
        </div>

        <Row>
          <Col xs={12} sm={3} className="store-sidebar mb-3 mb-sm-0">
            <SideLabel>Genres</SideLabel>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {CATEGORIES.map(cat => (
                <li key={cat}>
                  <CatBtn $active={activeCategory === cat} onClick={() => setCategory(cat)}>{cat}</CatBtn>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} sm={9}>
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: "#8250ff" }} />
                <p style={{ color: "#4a4560", marginTop: ".75rem", fontSize: ".85rem" }}>Cargando productos...</p>
              </div>
            )}
            {error && (
              <Alert style={{ background: "rgba(255,80,80,.08)", border: "1px solid rgba(255,80,80,.2)", color: "#ff9090" }}>
                ⚠ {error}
                <button onClick={() => window.location.reload()} style={{ marginLeft: "1rem", background: "transparent", border: "1px solid rgba(255,80,80,.3)", color: "#ff9090", borderRadius: 4, padding: "2px 10px", cursor: "pointer" }}>Reintentar</button>
              </Alert>
            )}
            {!loading && !error && (
              <>
                <ResultsCount>{filtered.length} resultados</ResultsCount>
                {paginated.length === 0 ? (
                  <p className="empty-msg">No se encontraron juegos.</p>
                ) : (
                  <Row xs={1} sm={2} lg={3} className="g-3">
                    {paginated.map(p => <Col key={p.id}><ProductCard product={p} /></Col>)}
                  </Row>
                )}
                {totalPages > 1 && (
                  <BSPagination>
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
                    ))}
                    <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                  </BSPagination>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}