import { useState, useEffect } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { RefreshCw, User, CheckCircle, XCircle, Calendar, UserCircle, Phone, IndianRupee, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

const Seats = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/seats');
      setSeats(data.data);
    } catch (error) {
      toast.error('Failed to fetch seats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = async (seat) => {
    if (seat.status === 'occupied' && seat.occupiedBy) {
      try {
        // Handle both populated object and ID string
        const studentId = typeof seat.occupiedBy === 'object' ? seat.occupiedBy._id : seat.occupiedBy;
        const { data } = await api.get(`/students/${studentId}`);
        setSelectedSeat({ ...seat, studentDetails: data.data });
        setShowModal(true);
      } catch (error) {
        toast.error('Failed to fetch student details');
        console.error('Fetch student error:', error);
      }
    } else {
      setSelectedSeat(seat);
      setShowModal(true);
    }
  };

  const filteredSeats = seats.filter((seat) => {
    const matchesType = filterType === 'all' || seat.seatType === filterType;
    const matchesStatus = filterStatus === 'all' || seat.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const stats = {
    total: seats.length,
    available: seats.filter((s) => s.status === 'available').length,
    occupied: seats.filter((s) => s.status === 'occupied').length,
    regular: seats.filter((s) => s.seatType === 'regular').length,
    premium: seats.filter((s) => s.seatType === 'premium').length,
    regularOccupied: seats.filter((s) => s.seatType === 'regular' && s.status === 'occupied').length,
    premiumOccupied: seats.filter((s) => s.seatType === 'premium' && s.status === 'occupied').length
  };

  const getSeatColor = (seat) => {
    if (seat.status === 'available') {
      return seat.seatType === 'premium'
        ? 'bg-purple-100 hover:bg-purple-200 border-purple-300'
        : 'bg-blue-100 hover:bg-blue-200 border-blue-300';
    }
    return seat.seatType === 'premium'
      ? 'bg-purple-500 text-white hover:bg-purple-600 border-purple-600'
      : 'bg-blue-500 text-white hover:bg-blue-600 border-blue-600';
  };

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
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              🪑 Seat Management
            </h1>
            <p className="text-purple-100 mt-2">Visual overview of all 121 seats (62 Regular + 59 Premium)</p>
          </div>
          <button 
            onClick={fetchSeats} 
            className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm border border-white border-opacity-30 rounded-xl transition-all font-semibold text-white flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-gray-600 mb-1">Total Seats</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg p-4 border border-green-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-green-700 mb-1">Available</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.available}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-lg p-4 border border-red-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-red-700 mb-1">Occupied</div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.occupied}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-4 border border-blue-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-blue-700 mb-1">Regular Total</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.regular}</div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-4 border border-indigo-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-indigo-700 mb-1">Regular Occupied</div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{stats.regularOccupied}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-4 border border-purple-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-purple-700 mb-1">Premium Total</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.premium}</div>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-lg p-4 border border-pink-200 hover:shadow-xl transition-shadow">
          <div className="text-xs font-medium text-pink-700 mb-1">Premium Occupied</div>
          <div className="text-2xl sm:text-3xl font-bold text-pink-600">{stats.premiumOccupied}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🔍</span>
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
            >
              <option value="all">All Types</option>
              <option value="regular">Regular Only</option>
              <option value="premium">Premium Only</option>
            </select>
          </div>
          <div>
            <label className="label">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="occupied">Occupied Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-xl mr-2">🎨</span>
          Legend
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-10 h-10 bg-blue-100 border-2 border-blue-300 rounded-lg flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Regular Available</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="w-10 h-10 bg-blue-500 border-2 border-blue-600 rounded-lg flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Regular Occupied</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-10 h-10 bg-purple-100 border-2 border-purple-300 rounded-lg flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Premium Available</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
            <div className="w-10 h-10 bg-purple-500 border-2 border-purple-600 rounded-lg flex-shrink-0"></div>
            <span className="text-sm font-medium text-gray-700">Premium Occupied</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
        {/* Screen indicator for cinema effect */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 text-white px-12 py-3 rounded-t-3xl text-base font-bold shadow-lg">
            📚 STUDY AREA FRONT 📚
          </div>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 mb-8 border-2 border-blue-200">
          <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🪑</span>
            Regular Seats (R1-R62) - {stats.regularOccupied}/{stats.regular} Occupied
          </h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2 mb-8">
          {filteredSeats
            .filter((seat) => seat.seatType === 'regular')
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((seat) => (
              <button
                key={seat._id}
                onClick={() => handleSeatClick(seat)}
                className={`${getSeatColor(
                  seat
                )} border-2 rounded-xl p-2 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[60px] hover:scale-110 hover:shadow-lg font-semibold`}
                title={`${seat.seatId} - ${seat.status}`}
              >
                <div className="text-xs font-mono font-bold">{seat.seatId}</div>
                {seat.status === 'occupied' && (
                  <User className="w-3 h-3 mt-1" />
                )}
              </button>
            ))}
        </div>
        </div>

        <div className="my-8 flex items-center justify-center">
          <div className="flex-1 border-t-4 border-dashed border-gray-300"></div>
          <span className="px-6 text-gray-500 font-semibold text-sm">• • •</span>
          <div className="flex-1 border-t-4 border-dashed border-gray-300"></div>
        </div>

        <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⭐</span>
            Premium Seats (P1-P59) - {stats.premiumOccupied}/{stats.premium} Occupied
          </h3>
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-2">
          {filteredSeats
            .filter((seat) => seat.seatType === 'premium')
            .sort((a, b) => a.seatNumber - b.seatNumber)
            .map((seat) => (
              <button
                key={seat._id}
                onClick={() => handleSeatClick(seat)}
                className={`${getSeatColor(
                  seat
                )} border-2 rounded-xl p-2 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[60px] hover:scale-110 hover:shadow-lg font-semibold`}
                title={`${seat.seatId} - ${seat.status}`}
              >
                <div className="text-xs font-mono font-bold">{seat.seatId}</div>
                {seat.status === 'occupied' && (
                  <User className="w-3 h-3 mt-1" />
                )}
              </button>
            ))}
        </div>
        </div>
      </div>

      {/* Seat Details Modal */}
      {showModal && selectedSeat && (
        <div className="modal-backdrop backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="fixed inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 top-8 bottom-8 sm:w-full sm:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className={`rounded-t-2xl p-6 ${
              selectedSeat.status === 'available' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                : selectedSeat.seatType === 'premium'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  Seat {selectedSeat.seatId}
                  {selectedSeat.status === 'available' ? (
                    <CheckCircle className="w-6 h-6 ml-3 text-green-300" />
                  ) : (
                    <User className="w-6 h-6 ml-3 text-white" />
                  )}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  selectedSeat.seatType === 'premium' 
                    ? 'bg-purple-200 text-purple-900' 
                    : 'bg-blue-200 text-blue-900'
                }`}>
                  {selectedSeat.seatType}
                </span>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {selectedSeat.status === 'occupied' && selectedSeat.studentDetails ? (
                <>
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Student Information</h4>
                  
                  {/* Student Photo and Basic Info */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex gap-4">
                      {/* Photo */}
                      <div className="flex-shrink-0">
                          {selectedSeat.studentDetails.photo ? (
                            <img
                              src={selectedSeat.studentDetails.photo}
                              alt={selectedSeat.studentDetails.name}
                              className="w-20 h-20 rounded-lg object-cover border-2 border-white shadow-md"
                            />
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-md flex items-center justify-center">
                              <UserCircle className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Name and Mobile */}
                        <div className="flex-1">
                          <h5 className="text-xl font-bold text-gray-900">{selectedSeat.studentDetails.name}</h5>
                          <a 
                            href={`tel:${selectedSeat.studentDetails.mobile}`}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center mt-2 w-fit"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            {selectedSeat.studentDetails.mobile}
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    {/* Plan and Status */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-xs text-gray-600">Time Plan</div>
                        <div className="font-semibold text-gray-900 mt-1">{selectedSeat.studentDetails.timePlan}</div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="text-xs text-gray-600">Fee Status</div>
                        <div className={`font-semibold mt-1 capitalize ${
                          selectedSeat.studentDetails.feeStatus === 'paid' ? 'text-green-600' : 
                          selectedSeat.studentDetails.feeStatus === 'partial' ? 'text-yellow-600' :
                          selectedSeat.studentDetails.feeStatus === 'advanced' ? 'text-purple-600' :
                          'text-red-600'
                        }`}>
                          {selectedSeat.studentDetails.feeStatus}
                        </div>
                      </div>
                    </div>
                    
                    {/* Fee Details */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Fee:</span>
                        <span className="font-bold text-blue-600">₹{selectedSeat.studentDetails.totalFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Paid:</span>
                        <span className="font-bold text-green-600">₹{selectedSeat.studentDetails.feePaid}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600">Due:</span>
                        <span className="font-bold text-red-600">₹{selectedSeat.studentDetails.feeDue}</span>
                      </div>
                    </div>
                    
                    {/* Dates */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                        <span className="text-sm text-gray-600">Join Date:</span>
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {format(new Date(selectedSeat.studentDetails.joinDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-2 border border-gray-200">
                        <span className="text-sm text-gray-600">Expiry Date:</span>
                        <div className="flex items-center text-sm font-semibold text-gray-900">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          {format(new Date(selectedSeat.studentDetails.expiryDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                    </div>
                    
                    {/* Added By */}
                    {selectedSeat.studentDetails.addedBy && (
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="flex items-center">
                          <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm text-gray-600">Added by:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {selectedSeat.studentDetails.addedBy.name}
                          </span>
                        </div>
                      </div>
                    )}
                </>
              ) : (
                // Available Seat
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="text-sm text-green-800 font-medium">
                    This seat is available for allocation.
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Assign it when adding a new {selectedSeat.seatType} student.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 sm:px-6 py-4 bg-gray-50">
              <button 
                onClick={() => setShowModal(false)} 
                className="btn btn-secondary w-full sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Seats;
