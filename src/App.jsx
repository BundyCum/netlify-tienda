import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Store from "./pages/Store";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Library from "./pages/Library";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="store" element={<Store />} />
                <Route path="store/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
                <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
