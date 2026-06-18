import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">◈</span>
        <span className="logo-text">TETRUX</span>
      </Link>

      <nav className="navbar-links">
        <NavLink to="/store" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Store
        </NavLink>
        {user && (
          <NavLink to="/library" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Library
          </NavLink>
        )}
      </nav>

      <div className="navbar-actions">
        <NavLink to="/cart" className="cart-btn">
          <span className="cart-icon">⊡</span>
          <span className="cart-label">Cart</span>
          {count > 0 && <span className="cart-badge">{count}</span>}
        </NavLink>

        {user ? (
          <div className="user-menu">
            <div className="user-avatar">{user.avatar}</div>
            <span className="user-name">{user.username}</span>
            <button onClick={handleLogout} className="btn-ghost">Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary">Sign In</Link>
        )}
      </div>
    </header>
  );
}
