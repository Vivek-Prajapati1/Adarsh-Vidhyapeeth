import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Armchair,
  IndianRupee,
  Settings,
  FileText,
  UserCog,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { isAdmin, user } = useAuth();

  const navItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['admin', 'director']
    },
    {
      path: '/dashboard/students',
      icon: Users,
      label: 'Students',
      roles: ['admin', 'director']
    },
    {
      path: '/dashboard/payments',
      icon: CreditCard,
      label: 'Payments',
      roles: ['admin', 'director']
    },
    {
      path: '/dashboard/seats',
      icon: Armchair,
      label: 'Seats',
      roles: ['admin', 'director']
    },
    {
      path: '/dashboard/collections',
      icon: IndianRupee,
      label: 'Collections',
      roles: ['admin', 'director']
    },
    {
      path: '/dashboard/directors',
      icon: UserCog,
      label: 'Directors',
      roles: ['admin']
    },
    {
      path: '/dashboard/pricing',
      icon: Settings,
      label: 'Pricing',
      roles: ['admin']
    },
    {
      path: '/dashboard/audit-logs',
      icon: FileText,
      label: 'Audit Logs',
      roles: ['admin']
    }
  ];

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 sm:h-18 flex items-center justify-between border-b border-gray-200 px-5 bg-gradient-to-r from-blue-600 to-indigo-600">
          <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img 
                src="/logo.svg" 
                alt="Adarsh Vidhyapeeth Logo" 
                className="w-10 h-10"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white font-devanagari">
                आदर्श VIDHYAPEETH
              </h1>
              <p className="text-xs text-blue-100">Management System</p>
            </div>
          </Link>
          {/* Close button - only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-2">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 hover:scale-102'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100 group-hover:bg-blue-100'
                    }`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-md">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-white font-bold text-base">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-600 capitalize flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
