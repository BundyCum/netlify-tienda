import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo-icon">◈</span>
          <span className="footer-logo-text">TETRUX</span>
          <p className="footer-tagline">Your digital game store.</p>
        </div>

        <nav className="footer-nav">
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/store" className="footer-link">Store</Link></li>
            <li><Link to="/cart" className="footer-link">Cart</Link></li>
            <li><a href="#about" className="footer-link">About Us</a></li>
            <li><a href="#privacy" className="footer-link">Privacy Policy</a></li>
          </ul>
        </nav>
      </div>

      <hr className="footer-divider" />

      <div className="footer-copyright">
        <p>© {currentYear} <span className="footer-brand-name">TETRUX Store</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
