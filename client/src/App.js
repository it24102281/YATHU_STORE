import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Components
import WhatsAppButton from './components/WhatsAppButton';
import PublicLayout from './components/PublicLayout';
import ScrollToTop from './components/ScrollToTop';

// Context
import { AuthProvider } from './context/AuthContext';
import RequireUserAuth from './components/RequireUserAuth';

// Lazy Loaded Public Pages
const Home = lazy(() => import('./pages/Home'));
const Accounts = lazy(() => import('./pages/Accounts'));
const AccountDetails = lazy(() => import('./pages/AccountDetails'));
const UCPackages = lazy(() => import('./pages/UCPackages'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const SoldProofs = lazy(() => import('./pages/SoldProofs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Reviews = lazy(() => import('./pages/Reviews'));
const SocialBooster = lazy(() => import('./pages/SocialBooster'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const UserLogin = lazy(() => import('./pages/user/UserLogin'));
const UserSignup = lazy(() => import('./pages/user/UserSignup'));
const UserForgotPassword = lazy(() => import('./pages/user/UserForgotPassword'));
const UserResetPassword = lazy(() => import('./pages/user/UserResetPassword'));
const UserProfile = lazy(() => import('./pages/user/UserProfile'));
const UserOrders = lazy(() => import('./pages/user/UserOrders'));

// Lazy Loaded Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminFinance = lazy(() => import('./pages/admin/AdminFinance'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminAccounts = lazy(() => import('./pages/admin/AdminAccounts'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminForgotPassword = lazy(() => import('./pages/admin/AdminForgotPassword'));
const AdminResetPassword = lazy(() => import('./pages/admin/AdminResetPassword'));

// Loading Placeholder
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-4"></div>
    <p className="text-gray-400 text-sm animate-pulse">Loading Page...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
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
                  <Route path="/user/dashboard" element={<RequireUserAuth><UserProfile /></RequireUserAuth>} />
                  <Route path="/user/profile" element={<RequireUserAuth><UserProfile /></RequireUserAuth>} />
                  <Route path="/user/orders" element={<RequireUserAuth><UserOrders /></RequireUserAuth>} />
                </Route>

                {/* Admin Routes */}
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
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
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                <Route path="/admin/reset-password" element={<AdminResetPassword />} />

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
            </Suspense>
          </AnimatePresence>

          <WhatsAppButton />
          <SpeedInsights />
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
