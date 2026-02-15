import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { RefreshCw, Edit2, Save, X, IndianRupee, Clock, Award } from 'lucide-react';

const Pricing = () => {
  const { isAdmin } = useAuth();
  const [pricing, setPricing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied: Admin only');
      return;
    }
    fetchPricing();
  }, [isAdmin]);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/pricing');
      setPricing(data.data);
    } catch (error) {
      toast.error('Failed to fetch pricing');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (priceItem) => {
    setEditingId(priceItem._id);
    setEditValue(priceItem.price.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (priceItem) => {
    const newPrice = parseInt(editValue);

    if (isNaN(newPrice) || newPrice < 1) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      await api.put(`/pricing/${priceItem._id}`, { price: newPrice });
      toast.success('Pricing updated successfully');
      setEditingId(null);
      setEditValue('');
      fetchPricing();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update pricing');
    }
  };

  const getPricingIcon = (type, plan) => {
    if (type === 'premium') {
      return <Award className="w-8 h-8 text-purple-600" />;
    }
    return <Clock className="w-8 h-8 text-blue-600" />;
  };

  const getPricingColor = (type) => {
    if (type === 'premium') {
      return 'from-purple-500 to-purple-600';
    }
    return 'from-blue-500 to-blue-600';
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold">Access Denied</h3>
        <p className="text-red-600 mt-2">Only administrators can manage pricing</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-teal-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              💰 Pricing Management
            </h1>
            <p className="text-green-100 mt-2">Manage seat pricing (Admin only)</p>
          </div>
          <button 
            onClick={fetchPricing} 
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30 rounded-xl transition-all font-semibold text-white flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg">
        <h4 className="font-bold text-yellow-900 flex items-center text-lg">
          <span className="text-2xl mr-3">⚠️</span>
          Important Notice
        </h4>
        <p className="text-yellow-800 mt-2">
          Changes to pricing will only affect new students. Existing students retain their original pricing.
          All pricing updates are logged in the audit system.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricing.map((priceItem) => (
          <div
            key={priceItem._id}
            className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* Card Header */}
            <div className={`bg-gradient-to-r ${getPricingColor(priceItem.studentType)} text-white p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {getPricingIcon(priceItem.studentType, priceItem.timePlan)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold capitalize">{priceItem.studentType}</h3>
                    <p className="text-white/90 text-sm font-medium">{priceItem.timePlan} Plan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-600 mb-3">Current Price</div>
                {editingId === priceItem._id ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-lg">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                        placeholder="Enter price"
                        autoFocus
                        min="1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(priceItem)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ₹{priceItem.price}
                      </span>
                      <span className="text-gray-500 text-sm">/ 1 month</span>
                    </div>
                    <button
                      onClick={() => startEdit(priceItem)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                    >
                      <Edit2 className="w-5 h-5" />
                      <span>Edit Price</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Plan Details */}
              <div className="space-y-3 pt-6 border-t-2 border-gray-100 mt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-600">Seat Type</span>
                  <span className="font-bold capitalize text-gray-900">{priceItem.studentType}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-600">Time Plan</span>
                  <span className="font-bold text-gray-900">{priceItem.timePlan}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-medium text-gray-600">Duration</span>
                  <span className="font-bold text-gray-900">1 Month (30 days)</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Summary Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <span className="text-2xl mr-3">📊</span>
            Pricing Summary
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th className="text-left">Type</th>
                <th className="text-left">Plan</th>
                <th className="text-left">Price</th>
                <th className="text-left">Duration</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((priceItem) => (
                <tr key={priceItem._id} className="hover:bg-gray-50 transition-colors">
                  <td>
                    <span className={`px-3 py-1 rounded-lg font-semibold text-sm ${
                      priceItem.studentType === 'premium' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {priceItem.studentType}
                    </span>
                  </td>
                  <td>
                    <span className="font-bold text-gray-900">{priceItem.timePlan}</span>
                  </td>
                  <td>
                    <span className="text-xl font-bold text-green-600">₹{priceItem.price}</span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-600 font-medium">30 days</span>
                  </td>
                  <td className="text-center">
                    {editingId === priceItem._id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => saveEdit(priceItem)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Save"
                        >
                          <Save className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(priceItem)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
