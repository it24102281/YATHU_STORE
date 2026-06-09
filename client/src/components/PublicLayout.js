import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
    const location = useLocation();
    const hideNavbarRoutes = new Set([
        '/user/login',
        '/user/signup',
        '/user/forgot-password',
        '/user/reset-password',
    ]);
    const shouldHideNavbar = hideNavbarRoutes.has(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <div className="min-h-screen">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default PublicLayout;
