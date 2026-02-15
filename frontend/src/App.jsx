import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import {AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Lazy load other pages (will be created)
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import Payments from './pages/Payments';
import Seats from './pages/Seats';
import Collections from './pages/Collections';
import Directors from './pages/Directors';
import Pricing from './pages/Pricing';
import AuditLogs from './pages/AuditLogs';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="payments" element={<Payments />} />
              <Route path="seats" element={<Seats />} />
              <Route path="collections" element={<Collections />} />
              <Route path="profile" element={<Profile />} />
              
              {/* Admin Only Routes */}
              <Route
                path="directors"
                element={
                  <ProtectedRoute adminOnly>
                    <Directors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pricing"
                element={
                  <ProtectedRoute adminOnly>
                    <Pricing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute adminOnly>
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
