import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Wallet,
  Activity,
  FileText,
  ChevronDown,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WalletTopUpModal from './WalletTopUpModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCustomerMenuOpen, setIsCustomerMenuOpen] = useState(false);
  const [isWalletTopUpOpen, setIsWalletTopUpOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, customer, isAuthenticated, isUserAuthenticated, logout, userLogout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCustomerMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const isPageTop = !isScrolled;
  const customerInitial = customer?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const formattedCustomerFunds = `LKR ${Number(customer?.walletBalance || 0).toLocaleString()}`;

  const handleAdminLogout = () => {
    logout();
    navigate('/');
  };

  const handleCustomerLogout = async () => {
    await userLogout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'UC Packages', path: '/uc-packages' },
    { name: 'Featured Deals', path: '/services' },
    { name: 'Social Booster', path: '/social-booster' },
    { name: 'Reviews', path: '/reviews' },
  ];

  const customerMenuItems = [
    { label: 'Account', path: '/user/profile?tab=profile', icon: User, tone: 'text-gray-200' },
    { label: 'Fund Tracker', path: '/user/profile?tab=tracker', icon: Activity, tone: 'text-gray-200' },
    { label: 'Fund Add History', path: '/user/profile?tab=funds', icon: Wallet, tone: 'text-gray-200' },
    { label: 'Terms', path: '/user/profile?tab=terms', icon: FileText, tone: 'text-gray-200' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2'
          : 'py-3'
      }`}
      style={{
        background: 'transparent',
        backdropFilter: 'none',
        WebkitBackdropFilter: 'none',
        borderBottom: 'none',
        boxShadow: 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0 rounded-2xl px-2 py-1 transition-all duration-300 hover:bg-purple-500/10 hover:shadow-[0_0_22px_rgba(168,85,247,0.18)]">
            <div className="flex flex-col items-start text-left">
              <span
                className="font-black text-lg leading-none tracking-tight"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  background: 'linear-gradient(135deg, #a855f7, #c084fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Yathu PUBG Store
              </span>
              <div className="w-full text-center text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                Gaming Marketplace
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-1 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-2 text-[15px] font-semibold whitespace-nowrap transition-all duration-300 rounded-xl hover:bg-purple-500/10 hover:shadow-[0_0_18px_rgba(168,85,247,0.22)] ${
                  isActive(link.path)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(168,85,247,0.2))', border: '1px solid rgba(139,92,246,0.4)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center justify-end min-w-[140px]">
            {isUserAuthenticated ? (
              <div className="relative flex items-center gap-3">
                <div className="inline-flex h-12 items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.12)]">
                  <Wallet className="mr-2 h-4 w-4 text-emerald-300" />
                  {formattedCustomerFunds}
                  <button
                    type="button"
                    onClick={() => setIsWalletTopUpOpen(true)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-100 transition hover:border-emerald-300/50 hover:bg-emerald-400/20"
                    aria-label="Add funds to wallet"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => setIsCustomerMenuOpen((prev) => !prev)}
                  className="inline-flex h-14 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 transition-all duration-300 hover:border-purple-400/35 hover:bg-white/[0.06]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-sm font-black text-white shadow-[0_10px_24px_rgba(139,92,246,0.32)]">
                    {customerInitial}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isCustomerMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCustomerMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0b11]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                    >
                      <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                        <div className="text-lg font-black text-white">{customer?.fullName || 'Customer'}</div>
                        <div className="mt-1 text-sm text-gray-400">{customer?.email || 'Signed in'}</div>
                      </div>

                      <div className="mt-3 space-y-2">
                        {customerMenuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              setIsCustomerMenuOpen(false);
                              navigate(item.path);
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <item.icon className={`h-4 w-4 ${item.tone}`} />
                            <span className={item.tone}>{item.label}</span>
                          </button>
                        ))}
                        <button
                          onClick={async () => {
                            setIsCustomerMenuOpen(false);
                            await handleCustomerLogout();
                          }}
                          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 hover:text-white"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="inline-flex items-center gap-2 rounded-2xl border border-purple-500/25 bg-purple-500/10 px-5 py-3 text-sm font-semibold text-purple-200 transition-all duration-300 hover:text-white hover:shadow-[0_0_18px_rgba(168,85,247,0.22)]"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition-all duration-300 hover:text-white hover:shadow-[0_0_18px_rgba(248,113,113,0.18)]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/user/login')}
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(168,85,247,0.34)]"
                style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)', border: '1px solid rgba(139,92,246,0.4)', boxShadow: '0 12px 28px rgba(139,92,246,0.18)' }}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden absolute left-0 right-0 top-full bg-[#08080c]/98 backdrop-blur-3xl border-b border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] px-6 py-5"
          >
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/5">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-purple-400">{admin?.name}</div>
                        <div className="text-xs text-gray-500">Administrator</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/admin/dashboard');
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all duration-200"
                    >
                      Dashboard
                    </button>
                    <button onClick={handleAdminLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                      Logout
                    </button>
                  </>
                ) : isUserAuthenticated ? (
                  <>
                    <div className="px-4 py-3 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                        {customerInitial}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-purple-400">{customer?.fullName}</div>
                        <div className="text-xs text-gray-500">{formattedCustomerFunds}</div>
                      </div>
                    </div>
                    {customerMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate(item.path);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 rounded-xl transition-all duration-200"
                      >
                        {item.label}
                      </button>
                    ))}
                    <button onClick={handleCustomerLogout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                      Logout
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsWalletTopUpOpen(true);
                      }}
                      className="block w-full text-left px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition-all duration-200"
                    >
                      Add Funds
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/user/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200">
                      <User className="w-4 h-4" />
                      <span>Sign In</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <WalletTopUpModal
        isOpen={isWalletTopUpOpen}
        onClose={() => setIsWalletTopUpOpen(false)}
        customerName={customer?.fullName || 'Customer'}
        currentBalance={customer?.walletBalance || 0}
      />
    </nav>
  );
};

export default Navbar;
