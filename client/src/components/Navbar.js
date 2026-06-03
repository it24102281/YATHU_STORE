import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  ChevronDown,
  Shield,
  Package,
  MessageSquare,
  LogOut,
  Gamepad2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Accounts', path: '/accounts' },
    { name: 'UC Packages', path: '/uc-packages' },
    { name: 'Featured Deals', path: '/services' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 shadow-2xl shadow-black/50'
          : 'py-3'
      }`}
      style={{
        background: isScrolled
          ? 'rgba(10,10,10,0.95)'
          : 'rgba(10,10,10,0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(139,92,246,0.12)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
              <img
                src="/logo.JPG"
                alt="Yathu Official"
                className="h-11 w-11 object-cover rounded-xl border border-purple-500/30"
              />
            </motion.div>
            <div className="hidden sm:block">
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
                Yathu Official
              </span>
              <div className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                Gaming Marketplace
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl ${
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

          {/* Right: Admin Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white transition-all duration-300"
                  style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8b5cf6,#a855f7)' }}>
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>{admin?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-2xl"
                      style={{ background: 'rgba(17,17,17,0.98)', backdropFilter: 'blur(24px)', border: '1px solid rgba(139,92,246,0.2)' }}
                    >
                      <div className="p-2 space-y-1">
                        {[
                          { to: '/admin', icon: Shield, label: 'Dashboard' },
                          { to: '/admin/accounts', icon: Package, label: 'Accounts' },
                          { to: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
                        ].map(({ to, icon: Icon, label }) => (
                          <Link key={to} to={to} onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:text-purple-400 hover:bg-purple-500/10 transition-all duration-200">
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="p-2 border-t border-white/5">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden border-t border-white/5 mt-1"
            >
              <div className="py-4 space-y-1">
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
                      {[
                        { to: '/admin', label: 'Dashboard' },
                        { to: '/admin/accounts', label: 'Accounts' },
                        { to: '/admin/contacts', label: 'Contacts' },
                      ].map(({ to, label }) => (
                        <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-400 hover:text-purple-400 hover:bg-purple-500/5 rounded-xl transition-all duration-200">
                          {label}
                        </Link>
                      ))}
                      <button onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200">
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200">
                      <Shield className="w-4 h-4" />
                      <span>Admin Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
