import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { UserPlus, ArrowLeft, Calendar, IndianRupee, User } from 'lucide-react';
import { format, addDays } from 'date-fns';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    studentType: 'regular',
    timePlan: '12',
    seatNumber: '',
    joinDate: format(new Date(), 'yyyy-MM-dd')
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  useEffect(() => {
    if (formData.studentType) {
      fetchAvailableSeats(formData.studentType);
    }
  }, [formData.studentType]);

  useEffect(() => {
    calculatePrice();
  }, [formData.studentType, formData.timePlan, pricing]);

  const fetchPricing = async () => {
    try {
      const { data } = await api.get('/pricing');
      setPricing(data.data);
    } catch (error) {
      toast.error('Failed to fetch pricing');
      console.error(error);
    }
  };

  const fetchAvailableSeats = async (type) => {
    try {
      const { data } = await api.get(`/seats/available/${type}`);
      setAvailableSeats(data.data);
      setFormData((prev) => ({ ...prev, seatNumber: '' }));
    } catch (error) {
      toast.error('Failed to fetch available seats');
      console.error(error);
    }
  };

  const calculatePrice = () => {
    if (pricing.length > 0 && formData.studentType && formData.timePlan) {
      const price = pricing.find(
        (p) => p.type === formData.studentType && p.plan === `${formData.timePlan}hr`
      );
      setSelectedPrice(price || null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.seatNumber) {
      toast.error('Please select a seat');
      return;
    }

    if (availableSeats.length === 0) {
      toast.error(`No ${formData.studentType} seats available`);
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('mobile', formData.mobile);
    submitData.append('email', formData.email);
    submitData.append('address', formData.address);
    submitData.append('studentType', formData.studentType);
    submitData.append('timePlan', `${formData.timePlan}hr`);
    submitData.append('seatNumber', formData.seatNumber);
    submitData.append('joinDate', formData.joinDate);

    if (photoFile) {
      submitData.append('photo', photoFile);
    }

    try {
      setLoading(true);
      await api.post('/students', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Student added successfully!');
      navigate('/dashboard/students');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  const getExpiryDate = () => {
    if (!formData.joinDate || !formData.timePlan) return 'N/A';
    const days = 30; // All plans are 1 month (30 days)
    return format(addDays(new Date(formData.joinDate), days), 'dd MMM yyyy');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/students')}
            className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl transition-all backdrop-blur-sm border border-white border-opacity-30"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <UserPlus className="w-8 h-8 mr-3" />
              Add New Student
            </h1>
            <p className="text-blue-100 mt-2">Register a new student and allocate seat</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="p-6 sm:p-8 space-y-8">
          {/* Personal Information */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="label">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input"
                  placeholder="10-digit mobile"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div>
                <label className="label">Email (Optional)</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="label">Join Date *</label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input"
                  rows="2"
                  placeholder="Enter full address"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Photo (Optional)</h3>
            </div>
            <div className="flex items-center space-x-4">
              {photoPreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-300">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  onChange={handlePhotoChange}
                  className="input"
                  accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-1">Upload student photo (optional)</p>
              </div>
            </div>
          </div>

          {/* Seat & Plan Selection */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Seat & Plan Selection</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label">Student Type *</label>
                <select
                  name="studentType"
                  value={formData.studentType}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {availableSeats.length} {formData.studentType} seats available
                </p>
              </div>

              <div>
                <label className="label">Time Plan *</label>
                <select
                  name="timePlan"
                  value={formData.timePlan}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="6">6 Hours/Day (1 Month)</option>
                  <option value="12">12 Hours/Day (1 Month)</option>
                  <option value="24">24 Hours/Day (1 Month)</option>
                </select>
              </div>

              <div>
                <label className="label">Select Seat *</label>
                <select
                  name="seatNumber"
                  value={formData.seatNumber}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">-- Select Seat --</option>
                  {availableSeats.map((seat) => (
                    <option key={seat._id} value={seat.seatId}>
                      {seat.seatId}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fee Summary */}
          {selectedPrice && (
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                  <IndianRupee className="w-5 h-5 text-white" />
                </div>
                Fee Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="text-sm text-orange-700 font-medium">Plan Type</div>
                  <div className="font-bold text-orange-900 mt-2 capitalize text-lg">
                    {selectedPrice.type} - {selectedPrice.plan}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="text-sm text-orange-700 font-medium">Total Fee</div>
                  <div className="text-3xl font-bold text-orange-900 mt-2">
                    ₹{selectedPrice.price}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="text-sm text-orange-700 font-medium">Expiry Date</div>
                  <div className="font-bold text-orange-900 mt-2 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {getExpiryDate()}
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white rounded-xl">
                <p className="text-sm text-orange-800 flex items-center">
                  <span className="text-lg mr-2">💡</span>
                  <span className="font-medium">Payment can be recorded separately in the Payments section</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 sm:px-8 py-5 flex flex-col sm:flex-row justify-end gap-3 rounded-b-2xl border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/dashboard/students')}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading || availableSeats.length === 0}
          >
            {loading ? (
              <>
                <div className="spinner-small mr-2"></div>
                Adding Student...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Add Student
              </>
            )}
          </button>
        </div>
      </form>

      {/* No Seats Available Warning */}
      {availableSeats.length === 0 && formData.studentType && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h4 className="font-bold text-yellow-900 text-lg">No Seats Available</h4>
              <p className="text-yellow-800 mt-2">
                All <span className="font-semibold capitalize">{formData.studentType}</span> seats are currently occupied. Please free up a seat or choose a different type.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddStudent;
