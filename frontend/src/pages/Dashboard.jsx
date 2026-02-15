import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
  Users,
  UserCheck,
  UserX,
  Armchair,
  IndianRupee,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch multiple stats in parallel
      const [studentsRes, seatsRes, collectionsRes] = await Promise.all([
        api.get('/students/stats'),
        api.get('/seats/stats'),
        api.get('/payments/stats/collection')
      ]);

      setStats({
        students: studentsRes.data.data,
        seats: seatsRes.data.data,
        collections: collectionsRes.data.data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 sm:p-8 text-white overflow-hidden shadow-xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 font-devanagari">
                स्वागत है, {user?.name}!
              </h1>
              <p className="text-base sm:text-lg text-blue-100 mb-2">
                {isAdmin ? '🔐 Admin Dashboard' : '👔 Director Dashboard'}
              </p>
              <p className="text-sm text-blue-200">
                Manage your library efficiently with powerful tools
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white bg-opacity-20 backdrop-blur-md px-4 py-2 rounded-xl border border-white border-opacity-30">
                <p className="text-xs text-blue-100">Today</p>
                <p className="text-sm font-semibold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Total Active Students */}
        <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-blue-700 mb-1">Active Students</p>
            <p className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
              {stats?.students?.total?.active || 0}
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 bg-white rounded-md text-blue-700 font-medium">
                R: {stats?.students?.byType?.regular || 0}
              </span>
              <span className="px-2 py-1 bg-white rounded-md text-purple-700 font-medium">
                P: {stats?.students?.byType?.premium || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Expired Students */}
        <div className="group bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <UserX className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-red-700 mb-1">Expired</p>
            <p className="text-3xl sm:text-4xl font-bold text-red-900">
              {stats?.students?.total?.expired || 0}
            </p>
            <p className="text-xs text-red-600 mt-2">Students pending renewal</p>
          </div>
        </div>

        {/* Available Seats */}
        <div className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Armchair className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-green-700 mb-1">Available Seats</p>
            <p className="text-3xl sm:text-4xl font-bold text-green-900">
              {stats?.seats?.overall?.available || 0}
            </p>
            <p className="text-xs text-green-600 mt-2">of {stats?.seats?.overall?.total || 0} total seats</p>
          </div>
        </div>

        {/* Today's Collection */}
        <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg hover:shadow-2xl p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <IndianRupee className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-orange-700 mb-1">Today's Collection</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-900">
              ₹{stats?.collections?.todayCollection?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-orange-600 mt-2">💰 Revenue collected today</p>
          </div>
        </div>
      </div>

      {/* Seat Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Regular Seats */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              🪑 Regular Seats
            </h3>
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
              Standard
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Seats</span>
              <span className="font-semibold">{stats?.seats?.regular?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Occupied</span>
              <span className="font-semibold text-red-600">{stats?.seats?.regular?.occupied || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">{stats?.seats?.regular?.available || 0}</span>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-blue-600 h-2 sm:h-3 rounded-full transition-all"
                  style={{
                    width: `${((stats?.seats?.regular?.occupied || 0) / (stats?.seats?.regular?.total || 1)) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {Math.round(((stats?.seats?.regular?.occupied || 0) / (stats?.seats?.regular?.total || 1)) * 100)}% Occupied
              </p>
            </div>
          </div>
        </div>

        {/* Premium Seats */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              ⭐ Premium Seats
            </h3>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-semibold">
              Premium
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Seats</span>
              <span className="font-semibold">{stats?.seats?.premium?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Occupied</span>
              <span className="font-semibold text-red-600">{stats?.seats?.premium?.occupied || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-semibold text-green-600">{stats?.seats?.premium?.available || 0}</span>
            </div>
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className="bg-purple-600 h-2 sm:h-3 rounded-full transition-all"
                  style={{
                    width: `${((stats?.seats?.premium?.occupied || 0) / (stats?.seats?.premium?.total || 1)) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                {Math.round(((stats?.seats?.premium?.occupied || 0) / (stats?.seats?.premium?.total || 1)) * 100)}% Occupied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 sm:p-8 border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">
            💰 Collection Summary
          </h3>
          <TrendingUp className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-blue-500">
            <p className="text-sm font-medium text-gray-600 mb-2">Total Collection</p>
            <p className="text-3xl font-bold text-blue-600 mb-1">
              ₹{stats?.collections?.totalCollection?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-500">All payments combined</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-green-500">
            <p className="text-sm font-medium text-gray-600 mb-2">Regular Students</p>
            <p className="text-3xl font-bold text-green-600 mb-1">
              ₹{stats?.collections?.typeWise?.regular?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-500">Standard memberships</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-purple-500">
            <p className="text-sm font-medium text-gray-600 mb-2">Premium Students</p>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              ₹{stats?.collections?.typeWise?.premium?.toLocaleString('en-IN') || 0}
            </p>
            <p className="text-xs text-gray-500">Premium memberships</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">⚡ Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/dashboard/students/add"
            className="group relative p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-blue-200 hover:border-blue-400"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <Users className="w-10 h-10 mx-auto mb-3 text-blue-600 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800 text-center">Add Student</p>
          </a>
          <a
            href="/dashboard/payments"
            className="group relative p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-green-200 hover:border-green-400"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <IndianRupee className="w-10 h-10 mx-auto mb-3 text-green-600 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800 text-center">Add Payment</p>
          </a>
          <a
            href="/dashboard/students"
            className="group relative p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-purple-200 hover:border-purple-400"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <Users className="w-10 h-10 mx-auto mb-3 text-purple-600 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800 text-center">View Students</p>
          </a>
          <a
            href="/dashboard/seats"
            className="group relative p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 border-2 border-orange-200 hover:border-orange-400"
          >
            <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            <Armchair className="w-10 h-10 mx-auto mb-3 text-orange-600 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-semibold text-gray-800 text-center">View Seats</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
