import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { RiPlayLine, RiStore2Line } from "react-icons/ri";
import styled from "styled-components";
import "./Library.css";

const Avatar = styled.div`
  width:52px;height:52px;border-radius:50%;
  background:linear-gradient(135deg,#8250ff,#ff6eb4);
  display:flex;align-items:center;justify-content:center;
  font-size:1.2rem;font-weight:700;color:#fff;flex-shrink:0;
`;
const LibTitle = styled.h1`color:#e8e0ff;font-size:1.5rem;font-weight:800;margin:0 0 2px;letter-spacing:-.02em;`;
const LibSub = styled.p`color:#4a4560;font-size:.82rem;margin:0;`;
const GameCard = styled.div`background:#13121f;border:1px solid rgba(130,80,255,.12);border-radius:8px;overflow:hidden;transition:border-color .2s;&:hover{border-color:rgba(130,80,255,.35);}`;
const GameInfo = styled.div`padding:.75rem;display:flex;align-items:center;justify-content:space-between;`;
const GameName = styled.span`color:#c4b0ff;font-size:.875rem;font-weight:600;`;
const PlayBtn = styled.button`background:#8250ff;border:none;color:#fff;font-size:.75rem;font-weight:600;padding:.3rem .75rem;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:4px;transition:background .2s;&:hover{background:#9d6fff;}`;
const BrowseLink = styled(Link)`background:#8250ff;color:#fff!important;text-decoration:none;font-size:.875rem;font-weight:600;padding:.6rem 1.5rem;border-radius:5px;display:inline-flex;align-items:center;gap:6px;transition:background .2s;&:hover{background:#9d6fff!important;}`;

export default function Library() {
  const { user } = useAuth();
  const { cart } = useCart();

  return (
    <>
      <Helmet>
        <title>Biblioteca · TETRUX</title>
        <meta name="description" content={`La biblioteca de juegos de ${user?.username} en TETRUX.`} />
      </Helmet>
      <Container style={{ maxWidth: 1100, padding: "2rem 1rem" }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <Avatar>{user.avatar}</Avatar>
          <div>
            <LibTitle>{user.username}&apos;s Library</LibTitle>
            <LibSub>{cart.length} games in your collection</LibSub>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ color: "#4a4560", marginBottom: "1.5rem" }}>Tu biblioteca está vacía. Agregá juegos desde la tienda.</p>
            <BrowseLink to="/store"><RiStore2Line /> Ir a la tienda</BrowseLink>
          </div>
        ) : (
          <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {cart.map(game => (
              <Col key={game.id}>
                <GameCard>
                  <img src={game.image || `https://picsum.photos/seed/${game.id}/300/170`} alt={game.name} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                  <GameInfo>
                    <GameName>{game.name}</GameName>
                    <div className="d-flex align-items-center gap-2">
                      <PlayBtn><RiPlayLine /> Play</PlayBtn>
                      <Link to={`/store/${game.id}`} style={{ color: "#7a7290", fontSize: ".75rem", textDecoration: "none" }}>Details</Link>
                    </div>
                  </GameInfo>
                </GameCard>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
}
