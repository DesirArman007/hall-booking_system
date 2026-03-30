import { useState, useEffect } from 'react';
import { dummySeminarHalls, dummyBookings } from '../utils/dummyData';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { MapPin, Users, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export default function UserDashboard() {
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('halls'); // 'halls' or 'history'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        // Using 'u2' (John Doe) as a dummy logged-in user to show some bookings
        const myBookings = dummyBookings.filter(b => b.user === 'u2').map(b => ({
          ...b,
          hall: dummySeminarHalls.find(h => h._id === b.hall) || null
        }));
        setHalls(dummySeminarHalls);
        setBookings(myBookings);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.put(`/bookings/${id}/cancel`);
        toast.success('Booking cancelled successfully');
        fetchData(); // Refresh list
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">My Dashboard</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('halls')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'halls' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Halls
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Bookings
          </button>
        </div>
      </div>

      {activeTab === 'halls' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div key={hall._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{hall.name}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    hall.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {hall.status}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 text-sm">
                    <Users className="w-4 h-4 mr-2 text-green-600" />
                    Capacity: {hall.capacity} people
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-green-600" />
                    {hall.location}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {hall.amenities.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={hall.status === 'active' ? `/book/${hall._id}` : '#'}
                  className={`block w-full text-center py-2.5 rounded-lg font-medium transition-colors ${
                    hall.status === 'active' 
                      ? 'bg-green-600 hover:bg-green-500 text-white shadow-sm hover:shadow' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {hall.status === 'active' ? 'Book Now' : 'Unavailable'}
                </Link>
              </div>
            </div>
          ))}
          {halls.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No seminar halls available at the moment.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b uppercase tracking-wider">
                  <th className="p-4 font-semibold">Hall</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Time Slot</th>
                  <th className="p-4 font-semibold">Purpose</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{booking.hall?.name || 'Deleted Hall'}</td>
                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-400" />
                        {format(new Date(booking.date), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="p-4 text-gray-600">{booking.purpose}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {booking.status === 'confirmed' && new Date(booking.date) >= new Date(new Date().setHours(0,0,0,0)) && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      You haven't made any bookings yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
