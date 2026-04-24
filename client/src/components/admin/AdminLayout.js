import React, { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { Menu } from 'lucide-react';

const AdminLayout = () => {
    const { isAdmin, loading } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Allow access to login page without being authenticated
    if (location.pathname === '/admin/login') {
        return <Outlet />;
    }

    // Protect other admin routes
    if (!isAdmin()) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Mobile Header */}
                <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
                        ADMIN PANEL
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
