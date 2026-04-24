import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    LogOut,
    Gamepad2,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ mobileMenuOpen, setMobileMenuOpen }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/accounts', icon: Users, label: 'Accounts' },
        { path: '/admin/contacts', icon: MessageSquare, label: 'Contacts' }
    ];

    return (
        <>
            {/* Mobile sidebar backdrop */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar component */}
            <motion.aside
                initial={false}
                animate={{ x: mobileMenuOpen ? 0 : (window.innerWidth >= 1024 ? 0 : -280) }}
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/5 shadow-2xl shadow-purple-900/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-full flex flex-col justify-between">
                    <div>
                        {/* Logo area */}
                        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
                            <NavLink to="/" className="flex items-center gap-2 group">
                                <img src="/logo.JPG" alt="Yathu Pubg Store Logo" className="h-10 w-auto object-contain rounded-xl" />
                            </NavLink>
                            <button
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Navigation links */}
                        <nav className="p-4 space-y-2 mt-4">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                                Admin Panel
                            </div>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = location.pathname.startsWith(item.path);

                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeAdminTab"
                                                className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                                            />
                                        )}
                                        <Icon className={`w-5 h-5 relative z-10 transition-colors ${isActive ? 'text-purple-400' : 'group-hover:text-gray-300'}`} />
                                        <span className="font-medium relative z-10">{item.label}</span>
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User & Logout section */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            </motion.aside>
        </>
    );
};

export default Sidebar;
