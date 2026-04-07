import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, Outlet } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Layout Components
import Navbar from './components/layout/Navbar';
import CartDrawer from './components/layout/CartDrawer';
import MobileMenu from './components/layout/MobileMenu';
import SearchOverlay from './components/layout/SearchOverlay';
import NewsletterModal from './components/ui/NewsletterModal';
import BackgroundDecor from './components/ui/BackgroundDecor';
import Footer from './components/layout/Footer';

// Pages
import Hero from './components/layout/Hero';
import Collections from './components/products/Collections';
import FeaturedProducts from './components/products/FeaturedProducts';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Auth from './pages/Auth';
import Editorial from './pages/Editorial';
import AccessoriesShop from './pages/AccessoriesShop';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import ApparelShop from './pages/ApparelShop';
import CustomerAuth from './pages/CustomerAuth';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminProductUpload from './admin/AdminProductUpload';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminInventory from './admin/AdminInventory';

// Simple Route Guard for the Frontend
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Changed 'userInfo' to 'user' and added 'loading'
  const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';

  // Prevent redirect while AuthContext is still loading data from localStorage
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FBFBF9]">
        <p className="text-xs tracking-[0.3em] uppercase animate-pulse">Verifying Access...</p>
      </div>
    );
  }

  // Check if user is logged in via Context OR has the Admin flag
  const isAuthorized = user || isAdminLoggedIn;

  if (!isAuthorized) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

const Home = () => (
  <>
    <Hero />
    <Collections />
    <FeaturedProducts />
  </>
);

const NavbarWrapper = ({ setIsMenuOpen, setIsSearchOpen }) => {
  const { setIsCartOpen, cartCount } = useCart();
  return (
    <Navbar
      onCartClick={() => setIsCartOpen(true)}
      onMenuClick={() => setIsMenuOpen(true)}
      onSearchClick={() => setIsSearchOpen(true)}
      cartCount={cartCount}
    />
  );
};

const DrawerWrapper = () => {
  const { isCartOpen, setIsCartOpen } = useCart();
  return <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />;
};

// --- Customer Layout Wrapper ---
const CustomerLayout = ({ isMenuOpen, setIsMenuOpen, isSearchOpen, setIsSearchOpen }) => (
  <div className="relative min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden">
    <BackgroundDecor />
    <NavbarWrapper setIsMenuOpen={setIsMenuOpen} setIsSearchOpen={setIsSearchOpen} />
    <DrawerWrapper />
    <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onSearchClick={() => setIsSearchOpen(true)} />
    <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    <NewsletterModal />

    <main className="flex-grow relative z-10">
      <Outlet />
    </main>

    <Footer />
  </div>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (

    <AuthProvider>
      <CartProvider>
        <Router>

          {/* ✅ ADD THIS HERE */}
          <ToastContainer position="top-center" autoClose={2000} theme="dark" />

          <Routes>
            {/* --- STOREFRONT ROUTES --- */}
            <Route element={
              <CustomerLayout
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />
            }>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<CustomerAuth />} />
              <Route path="/editorial" element={<Editorial />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/accessories" element={<AccessoriesShop />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/garments" element={<ApparelShop />} />
            </Route>

            {/* --- ADMIN LOGIN --- */}
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* --- ADMIN PANEL --- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Index route: redirects /admin to /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="upload" element={<AdminProductUpload />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;