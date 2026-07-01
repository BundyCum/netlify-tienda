import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, get, query, limitToFirst } from "firebase/database";
import { db } from "../firebase/config";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import ProductCard from "../components/ProductCard";
import styled from "styled-components";
import "./Home.css";

const HeroSection = styled.section`
  background: #0a091a; border-bottom: 1px solid rgba(130,80,255,.15); padding: 3.5rem 0;
`;
const Eyebrow = styled.p`color:#8250ff;font-size:.75rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin:0 0 .75rem;`;
const HeroTitle = styled.h1`color:#e8e0ff;font-size:clamp(2rem,4vw,2.8rem);font-weight:800;line-height:1.1;margin:0 0 1rem;letter-spacing:-.02em;`;
const HeroSub = styled.p`color:#7a7290;font-size:1rem;line-height:1.6;margin:0 0 2rem;max-width:420px;`;
const HeroImg = styled.img`width:100%;border-radius:10px;border:1px solid rgba(130,80,255,.2);`;
const GlowWrap = styled.div`
  position:relative;
  &::before{content:"";position:absolute;inset:-20px;background:radial-gradient(ellipse at center,rgba(130,80,255,.15),transparent 70%);pointer-events:none;}
`;
const SectionTitle = styled.h2`color:#e8e0ff;font-size:1.2rem;font-weight:700;margin:0;letter-spacing:-.01em;`;
const SeeAll = styled(Link)`color:#8250ff;text-decoration:none;font-size:.85rem;transition:color .2s;&:hover{color:#c4b0ff;}`;
const CategoryChip = styled(Link)`
  background:rgba(130,80,255,.08);border:1px solid rgba(130,80,255,.2);
  color:#c4b0ff;text-decoration:none;font-size:.82rem;padding:.4rem 1rem;
  border-radius:20px;transition:all .2s;
  &:hover{background:rgba(130,80,255,.2);border-color:#8250ff;color:#e8e0ff;}
`;
const BtnPrimary = styled(Link)`
  background:#8250ff;color:#fff!important;text-decoration:none;font-size:.9rem;
  font-weight:600;padding:.65rem 1.5rem;border-radius:5px;display:inline-block;
  transition:background .2s;&:hover{background:#9d6fff!important;}
`;
const BtnGhost = styled(Link)`color:#9490b0;text-decoration:none;font-size:.9rem;transition:color .2s;&:hover{color:#e8e0ff;}`;

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(query(ref(db, "products"), limitToFirst(4)))
      .then((snap) => {
        if (snap.exists()) {
          const arr = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
          setFeatured(arr);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>TETRUX · Tu tienda de videojuegos</title>
        <meta name="description" content="Descubrí miles de videojuegos en TETRUX. Explorá el catálogo y llevate tu próxima aventura." />
        <meta property="og:title" content="TETRUX · Tu tienda de videojuegos" />
      </Helmet>

      <HeroSection>
        <Container style={{ maxWidth: 1100 }}>
          <Row className="align-items-center g-5">
            <Col xs={12} md={6}>
              <Eyebrow>New Release · 2025</Eyebrow>
              <HeroTitle>Discover Your<br />Next Adventure</HeroTitle>
              <HeroSub>Thousands of games. Endless worlds. Your library awaits.</HeroSub>
              <div className="d-flex gap-3 flex-wrap align-items-center">
                <BtnPrimary to="/store">Browse Store</BtnPrimary>
                <BtnGhost to="/store">View all →</BtnGhost>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <GlowWrap>
                <HeroImg src="/Tetrux_foto.png" alt="TETRUX store" />
              </GlowWrap>
            </Col>
          </Row>
        </Container>
      </HeroSection>

      <Container style={{ maxWidth: 1100, padding: "3rem 1rem" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <SectionTitle>Featured &amp; Recommended</SectionTitle>
          <SeeAll to="/store">See all →</SeeAll>
        </div>

        {loading ? (
          <Row xs={1} sm={2} lg={4} className="g-3">
            {[...Array(4)].map((_, i) => (
              <Col key={i}><div className="skeleton-card" style={{ aspectRatio: "3/4" }} /></Col>
            ))}
          </Row>
        ) : (
          <Row xs={1} sm={2} lg={4} className="g-3">
            {featured.map(p => <Col key={p.id}><ProductCard product={p} /></Col>)}
          </Row>
        )}

        <div className="mt-5">
          <SectionTitle className="mb-3">Browse by Genre</SectionTitle>
          <div className="d-flex flex-wrap gap-2">
            {["Action", "RPG", "Strategy", "Indie", "Horror", "Simulation"].map(cat => (
              <CategoryChip key={cat} to={`/store?category=${cat}`}>{cat}</CategoryChip>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}