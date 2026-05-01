import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected Route Component for Admin Pages
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const adminUser = localStorage.getItem('adminUser');

  // Check if token exists
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Verify user is an admin
  try {
    const user = JSON.parse(adminUser);
    if (!user || !user.role || (user.role !== 'admin' && user.role !== 'super-admin')) {
      // Clear invalid data and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (error) {
    // Invalid token data, redirect to login
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
