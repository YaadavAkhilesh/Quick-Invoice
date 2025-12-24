import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    // Log route protection status
    console.log('AdminProtectedRoute:', {
      path: location.pathname,
      isAuthenticated: !!admin,
      isLoading: loading
    });
  }, [admin, loading, location]);

  if (loading) {
    // Show a simple loading text for now
    return <div>Loading...</div>;
  }

  if (!admin) {
    console.log('No admin found, redirecting to login');
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return children;
};

export default AdminProtectedRoute;
