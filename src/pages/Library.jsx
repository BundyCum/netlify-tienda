import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "./Library.css";

export default function Library() {
  const { user } = useAuth();
  const { cart } = useCart();

  return (
    <div className="library-page">
      <div className="library-header">
        <div className="library-user">
          <div className="lib-avatar">{user.avatar}</div>
          <div>
            <h1 className="library-title">{user.username}'s Library</h1>
            <p className="library-sub">{cart.length} games in your collection</p>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="library-empty">
          <p>Your library is empty. Add games from the cart to see them here.</p>
          <Link to="/store" className="btn-browse">Go to Store</Link>
        </div>
      ) : (
        <div className="library-grid">
          {cart.map((game) => (
            <div key={game.id} className="library-item">
              <img
                src={game.image || `https://picsum.photos/seed/${game.id}/300/170`}
                alt={game.name}
                className="lib-img"
              />
              <div className="lib-info">
                <span className="lib-name">{game.name}</span>
                <div className="lib-actions">
                  <button className="play-btn">▶ Play</button>
                  <Link to={`/store/${game.id}`} className="lib-detail-link">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
