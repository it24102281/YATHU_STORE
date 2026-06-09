import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import WhatsAppButton from './components/WhatsAppButton';
import PublicLayout from './components/PublicLayout';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import UCPackages from './pages/UCPackages';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import SoldProofs from './pages/SoldProofs';
import FAQ from './pages/FAQ';
import Reviews from './pages/Reviews';
import SocialBooster from './pages/SocialBooster';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import UserLogin from './pages/user/UserLogin';
import UserSignup from './pages/user/UserSignup';
import UserForgotPassword from './pages/user/UserForgotPassword';
import UserResetPassword from './pages/user/UserResetPassword';
import UserProfile from './pages/user/UserProfile';
import UserOrders from './pages/user/UserOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminFinance from './pages/admin/AdminFinance';
import AdminOffers from './pages/admin/AdminOffers';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminContacts from './pages/admin/AdminContacts';
import AdminUsers from './pages/admin/AdminUsers';

// Context
import { AuthProvider } from './context/AuthContext';
import RequireUserAuth from './components/RequireUserAuth';

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/account/:id" element={<AccountDetails />} />
                <Route path="/uc-packages" element={<UCPackages />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/social-booster" element={<SocialBooster />} />
                <Route path="/sold-proofs" element={<SoldProofs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
                <Route path="/user/login" element={<UserLogin />} />
                <Route path="/user/signup" element={<UserSignup />} />
                <Route path="/user/forgot-password" element={<UserForgotPassword />} />
                <Route path="/user/reset-password" element={<UserResetPassword />} />
                <Route path="/user/profile" element={<RequireUserAuth><UserProfile /></RequireUserAuth>} />
                <Route path="/user/orders" element={<RequireUserAuth><UserOrders /></RequireUserAuth>} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/inventory" element={<AdminInventory />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/accounts" element={<AdminAccounts />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/finance" element={<AdminFinance />} />
                <Route path="/admin/offers" element={<AdminOffers />} />
              </Route>

              {/* Admin Login - No Layout */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center">
                    <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
                    <p className="text-xl text-gray-400 mb-8">Page not found</p>
                    <a href="/" className="btn-thej-primary">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>
          </AnimatePresence>

          <WhatsAppButton />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
