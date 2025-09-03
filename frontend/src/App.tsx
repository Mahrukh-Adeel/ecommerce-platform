import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import Home from "./pages/Home";
import Category from "./pages/Category";
import CategoryDetail from "./pages/CategoryDetail";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/Auth/SignupPage";
import LoginPage from "./pages/Auth/LoginPage";
import OAuthCallback from "./pages/Auth/OAuthCallback";
import Profile from "./pages/User/Profile";
import CartPage from "./pages/User/CartPage";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Admin/Dashboard";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageProducts from "./pages/Admin/ManageProducts";
import AddProducts from "./pages/Admin/AddProducts";
import Products from "./pages/Products";
import CheckoutPage from "./pages/User/Checkout";
import OrderConfirmation from "./pages/User/OrderConfirmation";

function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    // Initialize auth on app startup
    initializeAuth();
  }, [initializeAuth]);

  return (
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/success" element={<OAuthCallback />} />
      <Route path="/" element={<Home />} />
      <Route path="/categories" element={<Category />} />
      <Route path="/categories/:categoryId" element={<CategoryDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/admin/manage-orders" element={<ManageOrders />} />
      <Route path="/admin/manage-products" element={<ManageProducts />} />
      <Route path="/admin/add-products" element={<AddProducts />} />
      <Route path="/admin/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;
