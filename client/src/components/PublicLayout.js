import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen">
                <Outlet />
            </div>
            <Footer />
        </>
    );
};

export default PublicLayout;
