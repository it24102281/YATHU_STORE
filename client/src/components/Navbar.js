import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  ChevronDown,
  Shield,
  Package,
  MessageSquare,
  LogOut,
  Crown,
  Gamepad2
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Sold Proofs', path: '/sold-proofs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 nav-thej ${
      isScrolled 
        ? 'py-3 shadow-lg shadow-purple-500/10' 
        : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <img src="/logo.JPG" alt="Yathu Pubg Store Logo" className="h-14 md:h-16 w-auto object-contain rounded-xl" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl ${
                  isActive(link.path) 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Admin Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 text-sm font-bold text-gray-300 hover:text-purple-500 transition-colors bg-gray-800/50 px-4 py-2 rounded-xl hover:bg-gray-800/70"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span>{admin?.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-2 space-y-1">
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200 rounded-xl"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/accounts"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200 rounded-xl"
                        >
                          <Package className="w-4 h-4" />
                          <span>Accounts</span>
                        </Link>
                        <Link
                          to="/admin/contacts"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-all duration-200 rounded-xl"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Contacts</span>
                        </Link>
                      </div>
                      <div className="border-t border-gray-800 p-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 rounded-xl"
                        >
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
                className="flex items-center space-x-2 text-sm font-bold text-gray-300 hover:text-purple-500 transition-colors bg-gray-800/50 px-4 py-2 rounded-xl hover:bg-gray-800/70"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-3 rounded-xl text-gray-300 hover:text-purple-500 hover:bg-purple-500/10 transition-all duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-800 overflow-hidden"
            >
              <div className="py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-bold transition-all duration-300 hover:text-purple-500 hover:bg-purple-500/5 rounded-xl ${
                      isActive(link.path) ? 'text-purple-500 bg-purple-500/10' : 'text-gray-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="px-4 py-3 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-purple-500">{admin?.name}</div>
                          <div className="text-xs text-gray-400">Administrator</div>
                        </div>
                      </div>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-purple-500 hover:bg-purple-500/5 transition-all duration-300 rounded-xl"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/accounts"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-purple-500 hover:bg-purple-500/5 transition-all duration-300 rounded-xl"
                      >
                        Accounts
                      </Link>
                      <Link
                        to="/admin/contacts"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-gray-300 hover:text-purple-500 hover:bg-purple-500/5 transition-all duration-300 rounded-xl"
                      >
                        Contacts
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 rounded-xl"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-300 hover:text-purple-500 hover:bg-purple-500/5 transition-all duration-300 rounded-xl"
                  >
                    Admin Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
