import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Pages
import Home from './pages/Home';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import SoldProofs from './pages/SoldProofs';
import FAQ from './pages/FAQ';
import Reviews from './pages/Reviews';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminContacts from './pages/admin/AdminContacts';

// Layouts
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';

// Utils
import ScrollToTop from './components/ScrollToTop';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-black text-white">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes with Layout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/account/:id" element={<AccountDetails />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/sold-proofs" element={<SoldProofs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/refund" element={<Refund />} />
              </Route>

              {/* Admin Routes with Layout */}
              <Route element={<AdminLayout />}>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/accounts" element={<AdminAccounts />} />
                <Route path="/admin/contacts" element={<AdminContacts />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center">
                    <h1 className="text-6xl font-black gradient-text mb-4">404</h1>
                    <p className="text-xl text-gray-400 mb-8">Page not found</p>
                    <a href="/" className="btn-gaming-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </AnimatePresence>

          <WhatsAppButton />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
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
