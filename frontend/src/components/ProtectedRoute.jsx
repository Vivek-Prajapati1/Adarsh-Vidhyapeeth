import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // Show loading spinner while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  // If no token and no user, user is not logged in
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // If we have token but user state hasn't populated yet, try to use stored user
  // This handles the race condition right after login
  let currentUser = user;
  if (!user && token && storedUser) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      console.error('Could not parse stored user');
      return <Navigate to="/login" replace />;
    }
  }

  // Check admin access
  if (adminOnly && currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If we have no user data at all, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
