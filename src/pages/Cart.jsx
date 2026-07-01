import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useCart } from "../context/CartContext";
import { RiDeleteBinLine, RiShoppingCartLine } from "react-icons/ri";
import styled from "styled-components";
import "./Cart.css";

const PageTitle = styled.h1`color:#e8e0ff;font-size:1.6rem;font-weight:800;margin:0;letter-spacing:-.02em;`;
const ClearBtn = styled.button`background:transparent;border:none;color:#4a4560;font-size:.8rem;cursor:pointer;transition:color .2s;&:hover{color:#ff9090;}`;
const CartItem = styled.div`display:flex;gap:1rem;align-items:center;background:#13121f;border:1px solid rgba(130,80,255,.1);border-radius:8px;padding:.75rem;`;
const ItemImg = styled.img`width:90px;height:50px;object-fit:cover;border-radius:4px;flex-shrink:0;`;
const ItemName = styled(Link)`color:#e8e0ff;font-size:.9rem;font-weight:600;text-decoration:none;transition:color .2s;&:hover{color:#c4b0ff;}`;
const ItemPrice = styled.span`color:#a3ff8f;font-size:.95rem;font-weight:700;font-family:'Courier New',monospace;flex-shrink:0;`;
const RemoveBtn = styled.button`background:transparent;border:none;color:#4a4560;cursor:pointer;padding:4px;border-radius:3px;transition:all .2s;&:hover{color:#ff9090;background:rgba(255,80,80,.08);}`;
const Summary = styled.div`background:#13121f;border:1px solid rgba(130,80,255,.15);border-radius:8px;padding:1.25rem;position:sticky;top:80px;`;
const SummaryTitle = styled.h2`color:#e8e0ff;font-size:.95rem;font-weight:700;margin:0 0 1rem;`;
const SummaryRow = styled.div`display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:.5rem;`;
const Total = styled.div`display:flex;justify-content:space-between;font-weight:700;font-size:1rem;color:#e8e0ff;padding-top:.75rem;border-top:1px solid rgba(130,80,255,.1);margin-bottom:1.25rem;`;
const TotalPrice = styled.span`color:#a3ff8f;font-family:'Courier New',monospace;font-size:1.1rem;`;
const CheckoutBtn = styled.button`width:100%;background:#8250ff;border:none;color:#fff;font-size:.9rem;font-weight:600;padding:.7rem;border-radius:5px;cursor:pointer;transition:background .2s;margin-bottom:.75rem;&:hover{background:#9d6fff;}`;
const EmptyWrap = styled.div`text-align:center;padding:5rem 2rem;`;
const BrowseLink = styled(Link)`background:#8250ff;color:#fff!important;text-decoration:none;font-size:.875rem;font-weight:600;padding:.6rem 1.5rem;border-radius:5px;display:inline-flex;align-items:center;gap:6px;transition:background .2s;&:hover{background:#9d6fff!important;}`;

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  return (
    <>
      <Helmet>
        <title>Carrito · TETRUX</title>
      </Helmet>
      <Container style={{ maxWidth: 1000, padding: "2rem 1rem" }}>
        {cart.length === 0 ? (
          <EmptyWrap>
            <RiShoppingCartLine style={{ fontSize: "3rem", opacity: .2, marginBottom: "1rem", display: "block", margin: "0 auto 1rem" }} />
            <h1 className="cart-title mb-3">Tu carrito está vacío</h1>
            <BrowseLink to="/store"><RiShoppingCartLine /> Explorar tienda</BrowseLink>
          </EmptyWrap>
        ) : (
          <>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <PageTitle>Tu carrito</PageTitle>
              <ClearBtn onClick={clearCart}>Vaciar carrito</ClearBtn>
            </div>
            <Row className="g-4">
              <Col xs={12} lg={8}>
                <div className="d-flex flex-column gap-2">
                  {cart.map(item => (
                    <CartItem key={item.id}>
                      <ItemImg src={item.image || `https://picsum.photos/seed/${item.id}/90/50`} alt={item.name} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <ItemName to={`/store/${item.id}`}>{item.name}</ItemName>
                        <div style={{ color: "#4a4560", fontSize: ".75rem" }}>{item.category || "Game"}</div>
                      </div>
                      <ItemPrice>${Number(item.price).toFixed(2)}</ItemPrice>
                      <RemoveBtn onClick={() => removeFromCart(item.id)}><RiDeleteBinLine /></RemoveBtn>
                    </CartItem>
                  ))}
                </div>
              </Col>
              <Col xs={12} lg={4}>
                <Summary>
                  <SummaryTitle>Resumen del pedido</SummaryTitle>
                  {cart.map(item => (
                    <SummaryRow key={item.id}>
                      <span style={{ color: "#7a7290", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{item.name}</span>
                      <span style={{ color: "#c4b0ff", marginLeft: ".5rem" }}>${Number(item.price).toFixed(2)}</span>
                    </SummaryRow>
                  ))}
                  <Total><span>Total</span><TotalPrice>${total.toFixed(2)}</TotalPrice></Total>
                  <CheckoutBtn>Proceder al pago</CheckoutBtn>
                  <Link to="/store" style={{ display: "block", textAlign: "center", color: "#7a7290", fontSize: ".8rem", textDecoration: "none" }}>← Seguir comprando</Link>
                </Summary>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}
