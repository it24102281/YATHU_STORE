import React, { useState } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  LayoutDashboard,
  Box,
  ShoppingCart,
  DollarSign,
  Tag,
  LogOut,
  ChevronRight,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Inventory', icon: Box, path: '/admin/inventory' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Finance', icon: DollarSign, path: '/admin/finance' },
    { name: 'Offers', icon: Tag, path: '/admin/offers' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: isMobile ? -300 : 0, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? 'fixed' : 'relative'} z-40 w-64 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 border-r border-purple-500/20 overflow-y-auto`}
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-purple-500/20">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ADMIN
                </h1>
                {isMobile && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">Yathu PUBG Control Panel</p>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive ? 'text-white bg-purple-500/30' : 'text-gray-300 hover:text-white hover:bg-purple-500/20'}`
                  }
                >
                  <item.icon className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </NavLink>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-500/20 bg-gradient-to-t from-gray-950 to-transparent">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-400 mb-1">Logged in as</p>
                <p className="text-sm font-bold text-purple-300">{user?.username || 'Admin'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600/80 to-red-700/80 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 bg-gray-950 border-b border-purple-500/20 px-6 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-4">
            <NavLink
              to="/"
              className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Back to Store</span>
            </NavLink>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
