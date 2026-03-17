import { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      // First, use stored user data immediately (from login)
      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }
      
      // Then verify token is still valid with backend
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data.user);
        } catch (error) {
          console.error('Auth verification failed:', error);
          // If token validation fails, clear auth
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      
      if (!data.token || !data.user) {
        throw new Error('Invalid login response from server');
      }
      
      // Store token and user data immediately
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update React state immediately so ProtectedRoute can see it
      setUser(data.user);
      
      toast.success('Login successful!');
      return data.user;
    } catch (error) {
      // Clear any partial auth data on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin',
    isDirector: user?.role === 'director',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
