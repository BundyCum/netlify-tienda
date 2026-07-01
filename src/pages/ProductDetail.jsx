import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { RiShoppingCartLine, RiCheckLine, RiArrowLeftLine } from "react-icons/ri";
import styled from "styled-components";
import "./ProductDetail.css";

const BackBtn = styled.button`
  background:transparent;border:none;color:#7a7290;font-size:.85rem;
  cursor:pointer;padding:0;margin-bottom:1.5rem;display:flex;align-items:center;
  gap:5px;transition:color .2s;&:hover{color:#e8e0ff;}
`;
const Tag = styled.span`
  display:inline-block;background:rgba(130,80,255,.15);color:#c4b0ff;
  font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  padding:3px 10px;border-radius:3px;margin-bottom:1rem;
`;
const Title = styled.h1`color:#e8e0ff;font-size:2rem;font-weight:800;letter-spacing:-.02em;margin:0 0 1rem;line-height:1.1;`;
const Desc = styled.p`color:#7a7290;font-size:.9rem;line-height:1.7;margin:0 0 1.5rem;`;
const MetaRow = styled.div`
  display:flex;justify-content:space-between;font-size:.82rem;padding:.5rem 0;
  border-bottom:1px solid rgba(130,80,255,.08);
  &:last-child{border:none;}
  .label{color:#4a4560;} .val{color:#c4b0ff;}
`;
const Price = styled.span`color:#a3ff8f;font-size:1.7rem;font-weight:700;font-family:'Courier New',monospace;`;
const BuyBtn = styled.button`
  flex:1;border:none;font-size:.9rem;font-weight:600;padding:.7rem 1rem;
  border-radius:5px;cursor:pointer;display:flex;align-items:center;justify-content:center;
  gap:8px;transition:all .2s;
  background:${p => p.$inCart ? "rgba(163,255,143,.1)" : "#8250ff"};
  color:${p => p.$inCart ? "#a3ff8f" : "#fff"};
  border:${p => p.$inCart ? "1px solid rgba(163,255,143,.3)" : "none"};
  &:hover:not(:disabled){background:${p => p.$inCart ? "" : "#9d6fff"};}
`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inCart = cart.some(item => item.id === product?.id);

  useEffect(() => {
    setLoading(true);
    get(ref(db, `products/${id}`))
      .then((snap) => {
        if (!snap.exists()) throw new Error("Producto no encontrado");
        setProduct({ id: snap.key, ...snap.val() });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <Container style={{ maxWidth: 1100, padding: "3rem 1rem", textAlign: "center" }}>
      <Spinner animation="border" style={{ color: "#8250ff" }} />
    </Container>
  );

  if (error || !product) return (
    <Container style={{ maxWidth: 1100, padding: "4rem 1rem", textAlign: "center" }}>
      <p style={{ color: "#ff9090" }}>⚠ {error || "Producto no encontrado"}</p>
      <button onClick={() => navigate("/store")} style={{ background: "transparent", border: "1px solid rgba(130,80,255,.3)", color: "#c4b0ff", padding: ".5rem 1.25rem", borderRadius: 4, cursor: "pointer" }}>← Volver</button>
    </Container>
  );

  return (
    <>
      <Helmet>
        <title>{product.name} · TETRUX</title>
        <meta name="description" content={product.description?.slice(0, 150)} />
      </Helmet>
      <Container style={{ maxWidth: 1100, padding: "2rem 1rem" }}>
        <BackBtn onClick={() => navigate(-1)}><RiArrowLeftLine /> Volver</BackBtn>
        <Row className="g-5">
          <Col xs={12} lg={7}>
            <img src={product.image} alt={product.name} className="detail-img" />
          </Col>
          <Col xs={12} lg={5}>
            <Tag>{product.category || "Action"}</Tag>
            <Title>{product.name}</Title>
            <Desc>{product.description}</Desc>
            <div className="mb-4">
              <MetaRow><span className="label">Developer</span><span className="val">TETRUX Studios</span></MetaRow>
              <MetaRow><span className="label">Platform</span><span className="val">Windows, macOS</span></MetaRow>
              <MetaRow><span className="label">Stock</span><span className="val">{product.stock} unidades</span></MetaRow>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Price>${Number(product.price).toFixed(2)}</Price>
              <BuyBtn $inCart={inCart} onClick={() => addToCart(product)} disabled={inCart}>
                {inCart
                  ? <><RiCheckLine /> En el carrito</>
                  : <><RiShoppingCartLine /> Agregar al carrito</>
                }
              </BuyBtn>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}