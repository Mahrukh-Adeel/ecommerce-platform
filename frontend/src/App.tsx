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
import WishlistPage from "./pages/User/WishlistPage";
import ProductDetail from "./pages/ProductDetail";
import Dashboard from "./pages/Admin/Dashboard";
import ManageOrders from "./pages/Admin/ManageOrders";
import ManageProducts from "./pages/Admin/ManageProducts";
import ManageUsers from "./pages/Admin/ManageUsers";
import AddProducts from "./pages/Admin/AddProducts";
import Products from "./pages/Products";
import CheckoutPage from "./pages/User/Checkout";
import CreditCardDetailsPage from "./pages/User/CreditCardDetails";
import OrderConfirmation from "./pages/User/OrderConfirmation";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

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
      <Route path="/checkout/credit-card" element={<CreditCardDetailsPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/products" element={<Products />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      
      <Route path="/admin/dashboard" element={
        <AdminProtectedRoute>
          <Dashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/manage-orders" element={
        <AdminProtectedRoute>
          <ManageOrders />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/manage-products" element={
        <AdminProtectedRoute>
          <ManageProducts />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/add-products" element={
        <AdminProtectedRoute>
          <AddProducts />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/manage-users" element={
        <AdminProtectedRoute>
          <ManageUsers />
        </AdminProtectedRoute>
      } />
      
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App;