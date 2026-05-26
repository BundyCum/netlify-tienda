import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

export default function Cart() {
  const { cart, removeFromCart, clearCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="cart-title">Your Cart</h1>
        <div className="cart-empty">
          <div className="empty-icon">⊡</div>
          <p>Your cart is empty</p>
          <Link to="/store" className="btn-browse">Browse Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <button className="clear-btn" onClick={clearCart}>Clear all</button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image || `https://picsum.photos/seed/${item.id}/90/50`}
                alt={item.name}
                className="item-img"
              />
              <div className="item-info">
                <Link to={`/store/${item.id}`} className="item-name">{item.name}</Link>
                <span className="item-category">{item.category || "Game"}</span>
              </div>
              <span className="item-price">${Number(item.price).toFixed(2)}</span>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>✕</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="summary-rows">
            {cart.map((item) => (
              <div key={item.id} className="summary-row">
                <span className="summary-name">{item.name}</span>
                <span className="summary-price">${Number(item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Total</span>
            <span className="total-price">${total.toFixed(2)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
          <Link to="/store" className="continue-link">← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
