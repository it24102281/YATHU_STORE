import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireUserAuth = ({ children }) => {
  const { userLoading, isUserAuthenticated } = useAuth();
  const location = useLocation();

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center pt-24">
        <div className="w-10 h-10 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isUserAuthenticated) {
    return <Navigate to="/user/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireUserAuth;
