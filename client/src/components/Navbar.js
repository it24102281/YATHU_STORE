import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  Bell,
  Trash2,
  Megaphone,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Coins,
  Package
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
  const { api, admin, customer, isAuthenticated, isUserAuthenticated, logout, userLogout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isUserAuthenticated) return;
    try {
      setNotificationsLoading(true);
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err.message);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      const res = await api.post(`/notifications/read/${notifId}`);
      if (res.data?.success) {
        setNotifications(prev =>
          prev.map(n => (n._id === notifId ? { ...n, isRead: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await api.post('/notifications/read-all');
      if (res.data?.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err.message);
    }
  };

  const deleteNotification = async (notifId) => {
    try {
      const res = await api.delete(`/notifications/${notifId}`);
      if (res.data?.success) {
        const deletedNotif = notifications.find(n => n._id === notifId);
        setNotifications(prev => prev.filter(n => n._id !== notifId));
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Failed to delete notification:', err.message);
    }
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(prev => {
      const next = !prev;
      if (next) {
        fetchNotifications();
      }
      return next;
    });
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'order_created':
        return <Plus className="h-4 w-4" />;
      case 'order_completed':
      case 'refill_completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'order_cancelled':
        return <AlertCircle className="h-4 w-4" />;
      case 'refill_submitted':
        return <RefreshCw className="h-4 w-4" />;
      case 'wallet_credited':
        return <Coins className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      case 'account_delivered':
        return <Package className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotifIconStyle = (type) => {
    switch (type) {
      case 'order_created':
        return 'bg-blue-500/10 border border-blue-500/20 text-blue-400';
      case 'order_completed':
      case 'refill_completed':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'order_cancelled':
        return 'bg-red-500/10 border border-red-500/20 text-red-400';
      case 'refill_submitted':
        return 'bg-purple-500/10 border border-purple-500/20 text-purple-400';
      case 'wallet_credited':
        return 'bg-amber-500/10 border border-amber-500/20 text-amber-400';
      case 'announcement':
        return 'bg-pink-500/10 border border-pink-500/20 text-pink-400';
      case 'account_delivered':
        return 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400';
      default:
        return 'bg-gray-500/10 border border-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const renderNotificationsDropdown = (alignClass = 'right-0') => {
    return (
      <AnimatePresence>
        {isNotificationsOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`absolute ${alignClass} top-[calc(100%+12px)] w-[calc(100vw-2rem)] sm:w-96 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0b11]/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl z-50 shadow-[0_0_50px_rgba(168,85,247,0.15)]`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-base font-black text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-purple-400 animate-pulse" />
                Notifications
              </span>
              <div className="flex items-center gap-3">
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setIsViewAllOpen(true);
                  }}
                  className="text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  View All
                </button>
              </div>
            </div>

            {notificationsLoading && notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-500">
                <RefreshCw className="h-6 w-6 animate-spin text-purple-500" />
                <span className="text-xs">Loading notifications...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-300">No notifications</div>
                  <div className="text-xs text-gray-500 mt-1">We'll let you know when something happens!</div>
                </div>
              </div>
            ) : (
              <div className="mt-3 max-h-[360px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar animate-fadeIn">
                {notifications.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (!item.isRead) markAsRead(item._id);
                    }}
                    className={`group relative flex gap-3 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      item.isRead
                        ? 'bg-transparent border-white/5 hover:bg-white/[0.02]'
                        : 'bg-purple-500/[0.03] border-purple-500/10 hover:bg-purple-500/[0.05] hover:border-purple-500/20'
                    }`}
                  >
                    <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center mt-0.5 ${getNotifIconStyle(item.type)}`}>
                      {getNotifIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-5">
                      <div className="flex items-start justify-between gap-1.5">
                        <p className={`text-xs sm:text-sm font-bold truncate ${item.isRead ? 'text-gray-300' : 'text-white'}`}>
                          {item.title}
                        </p>
                        {!item.isRead && (
                          <span className="flex h-2 w-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed break-words">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-gray-500 mt-1.5 block">
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item._id);
                      }}
                      className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all duration-200"
                      title="Delete notification"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  useEffect(() => {
    if (isUserAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      setIsNotificationsOpen(false);
    }
  }, [isUserAuthenticated]);

  const renderViewAllModal = () => {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <AnimatePresence>
        {isViewAllOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0c0c12] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-xl font-black text-white flex items-center gap-2.5">
                  <Bell className="h-5 w-5 text-purple-400 animate-pulse" />
                  All Notifications
                </h3>
                <div className="flex items-center gap-4">
                  {notifications.length > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Mark All Read
                    </button>
                  )}
                  <button
                    onClick={() => setIsViewAllOpen(false)}
                    className="text-gray-400 hover:text-white text-sm font-semibold transition"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mt-4 pr-1 space-y-3 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                    <div className="h-16 w-16 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-500">
                      <Bell className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-gray-300">No notifications yet</div>
                      <div className="text-sm text-gray-500 mt-1">We'll notify you here when order or account events occur.</div>
                    </div>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        if (!item.isRead) markAsRead(item._id);
                      }}
                      className={`group relative flex gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                        item.isRead
                          ? 'bg-transparent border-white/5 hover:bg-white/[0.01]'
                          : 'bg-purple-500/[0.02] border-purple-500/10 hover:bg-purple-500/[0.04] hover:border-purple-500/20'
                      }`}
                    >
                      <div className={`flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${getNotifIconStyle(item.type)}`}>
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-sm sm:text-base font-bold truncate ${item.isRead ? 'text-gray-300' : 'text-white'}`}>
                            {item.title}
                          </p>
                          {!item.isRead && (
                            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed break-words">
                          {item.message}
                        </p>
                        <span className="text-[11px] text-gray-500 mt-2 block">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item._id);
                        }}
                        className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all duration-200"
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isNotificationsOpen && !event.target.closest('.notifications-container')) {
        setIsNotificationsOpen(false);
      }
      if (isCustomerMenuOpen && !event.target.closest('.customer-menu-container')) {
        setIsCustomerMenuOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isNotificationsOpen, isCustomerMenuOpen]);

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
      style={
        isScrolled
          ? {
              background: 'rgba(8, 8, 12, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            }
          : {
              background: 'transparent',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              borderBottom: 'none',
              boxShadow: 'none',
            }
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0 rounded-2xl px-2 py-1 transition-all duration-300 hover:bg-purple-500/10 hover:shadow-[0_0_22px_rgba(168,85,247,0.18)]">
            <div className="flex flex-col items-start text-left">
              <div className="logo-text">Yathu <span className="accent">PUBG</span> Store</div>
              <div className="logo-subtitle">GAMING MARKETPLACE</div>
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
                {/* Wallet Button */}
                <button
                  onClick={() => setIsWalletTopUpOpen(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-400/40 px-3.5 text-xs sm:text-sm font-bold text-purple-200 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.08)] hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                  aria-label="Wallet Balance"
                >
                  <Wallet className="h-4 w-4 text-purple-400" />
                  <span>LKR {Number(customer?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </button>

                {/* Notifications Button */}
                <div className="relative notifications-container">
                  <button
                    onClick={toggleNotifications}
                    className={`relative inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isNotificationsOpen
                        ? 'border-purple-500/40 bg-purple-500/12 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'border-white/10 bg-white/[0.04] text-gray-400 hover:border-purple-500/30 hover:bg-white/[0.06] hover:text-white'
                    }`}
                    aria-label="Toggle notifications"
                  >
                    <Bell className="h-4.5 w-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-1 ring-red-400/20">
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                        <span className="relative z-10">{unreadCount}</span>
                      </span>
                    )}
                  </button>
                  {renderNotificationsDropdown('right-0')}
                </div>

                {/* User Profile Button */}
                <div className="relative customer-menu-container">
                  <button
                    onClick={() => setIsCustomerMenuOpen((prev) => !prev)}
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-300 ${
                      isCustomerMenuOpen
                        ? 'border-purple-500/40 bg-purple-500/12 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'border-white/10 bg-white/[0.04] text-gray-300 hover:border-purple-500/30 hover:bg-white/[0.06] hover:text-white'
                    }`}
                    aria-label="User profile menu"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-violet-500 to-fuchsia-600 text-xs font-black text-white shadow-[0_4px_10px_rgba(139,92,246,0.3)] flex-shrink-0">
                      {customerInitial}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isCustomerMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-[24px] border border-white/10 bg-[#0b0b11]/95 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl z-50"
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
                              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-200 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <item.icon className="h-4 w-4 text-gray-400" />
                              <span>{item.label}</span>
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

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center gap-3">
              {isUserAuthenticated && (
                <div className="relative notifications-container">
                  <button
                    onClick={toggleNotifications}
                    className={`relative p-2.5 rounded-xl transition-all duration-200 ${
                      isNotificationsOpen
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'text-gray-400 hover:text-white bg-white/5'
                    }`}
                    aria-label="Toggle notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-1 ring-red-400/20">
                        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                        <span className="relative z-10">{unreadCount}</span>
                      </span>
                    )}
                  </button>
                  {renderNotificationsDropdown('right-[-52px]')}
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute left-0 right-0 top-full bg-[#08080c]/98 backdrop-blur-3xl border-b border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] px-6 py-5 z-[9999]"
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
      {renderViewAllModal()}
    </nav>
  );
};

export default Navbar;
