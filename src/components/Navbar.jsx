import { Link, NavLink, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar as BSNavbar } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { RiShoppingCartLine, RiStore2Line, RiBookmarkLine, RiSettings3Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import styled from "styled-components";

const Brand = styled(Link)`
  display: flex; align-items: center; gap: 8px;
  font-family: 'Courier New', monospace; font-weight: 700;
  font-size: 1.05rem; letter-spacing: .15em; color: #e8e0ff !important;
  text-decoration: none;
  .icon { color: #8250ff; font-size: 1.2rem; }
`;

const StyledNav = styled(BSNavbar)`
  background: #0d0d14 !important;
  border-bottom: 1px solid rgba(130,80,255,.2);
  position: sticky; top: 0; z-index: 100;
`;

const NavItem = styled(NavLink)`
  color: #9490b0 !important; font-size: .875rem; padding: .4rem .85rem !important;
  border-radius: 4px; text-decoration: none; display: flex; align-items: center; gap: 5px;
  transition: all .2s;
  &:hover, &.active { color: #e8e0ff !important; background: rgba(130,80,255,.1); }
`;

const CartBtn = styled(Link)`
  position: relative; display: flex; align-items: center; gap: 5px;
  color: #9490b0; text-decoration: none; font-size: .875rem;
  padding: .4rem .75rem; border-radius: 4px; transition: color .2s;
  &:hover { color: #e8e0ff; }
`;

const Badge = styled.span`
  position: absolute; top: 0; right: 0;
  background: #8250ff; color: #fff; font-size: .6rem; font-weight: 700;
  width: 15px; height: 15px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
`;

const Avatar = styled.div`
  width: 28px; height: 28px; border-radius: 50%;
  background: linear-gradient(135deg,#8250ff,#ff6eb4);
  display: flex; align-items: center; justify-content: center;
  font-size: .75rem; font-weight: 700; color: #fff;
`;

const UserName = styled.span`color:#c4b0ff;font-size:.82rem;`;

const SignOutBtn = styled.button`
  background: transparent; border: 1px solid rgba(130,80,255,.25);
  color: #9490b0; font-size: .8rem; padding: .3rem .7rem; border-radius: 4px;
  cursor: pointer; display: flex; align-items: center; gap: 4px;
  transition: all .2s; &:hover { border-color:#8250ff; color:#e8e0ff; }
`;

const SignInBtn = styled(Link)`
  background: #8250ff; color: #fff !important; text-decoration: none;
  font-size: .8rem; font-weight: 600; padding: .4rem 1rem; border-radius: 4px;
  transition: background .2s; &:hover { background: #9d6fff !important; }
`;

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <StyledNav expand="md" variant="dark">
      <Container fluid style={{ maxWidth: 1100, padding: "0 1rem" }}>
        <Brand to="/"><span className="icon">◈</span>TETRUX</Brand>
        <BSNavbar.Toggle aria-controls="main-nav" style={{ borderColor: "rgba(130,80,255,.3)" }} />
        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto ms-3 gap-1">
            <NavItem to="/store"><RiStore2Line /> Store</NavItem>
            {user && <NavItem to="/library"><RiBookmarkLine /> Library</NavItem>}
            {user && <NavItem to="/admin"><RiSettings3Line /> Admin</NavItem>}
          </Nav>
          <div className="d-flex align-items-center gap-2">
            <CartBtn to="/cart">
              <RiShoppingCartLine size={18} />
              <span>Cart</span>
              {count > 0 && <Badge>{count}</Badge>}
            </CartBtn>
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <Avatar>{user.avatar}</Avatar>
                <UserName className="d-none d-sm-block">{user.username}</UserName>
                <SignOutBtn onClick={() => { logout(); navigate("/"); }}>
                  <FiLogOut /> Sign out
                </SignOutBtn>
              </div>
            ) : (
              <SignInBtn to="/login">Sign In</SignInBtn>
            )}
          </div>
        </BSNavbar.Collapse>
      </Container>
    </StyledNav>
  );
}
