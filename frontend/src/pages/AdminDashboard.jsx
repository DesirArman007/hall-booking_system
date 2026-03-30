import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Users, Calendar as CalendarIcon, Layout, Activity, Plus, Edit2, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { dummyUsers, dummySeminarHalls, dummyBookings } from '../utils/dummyData';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [halls, setHalls] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tabs: 'overview', 'halls', 'bookings'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hall Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  
  // Hall Form
  const [hallForm, setHallForm] = useState({
    name: '', capacity: '', location: '', amenities: '', status: 'active'
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setTimeout(() => {
        const statsData = {
          totalBookings: dummyBookings.length,
          totalHalls: dummySeminarHalls.length,
          totalUsers: dummyUsers.length,
          bookingsToday: dummyBookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length
        };
        
        // Populate user and hall for bookings
        const populatedBookings = dummyBookings.map(b => ({
          ...b,
          user: dummyUsers.find(u => u.id === b.user) || null,
          hall: dummySeminarHalls.find(h => h.id === b.hall) || null
        }));

        setStats(statsData);
        setHalls([...dummySeminarHalls]); // Clone to allow local edits (UI only)
        setBookings(populatedBookings);
        setLoading(false);
      }, 500);
    } catch (error) {
      toast.error('Failed to load admin data');
      setLoading(false);
    }
  };

  const handleHallSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...hallForm,
        capacity: Number(hallForm.capacity),
        amenities: hallForm.amenities.split(',').map(item => item.trim()).filter(Boolean)
      };

      if (editingHall) {
        await api.put(`/halls/${editingHall._id}`, payload);
        toast.success('Hall updated successfully');
      } else {
        await api.post('/halls', payload);
        toast.success('Hall created successfully');
      }
      setIsModalOpen(false);
      setEditingHall(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save hall');
    }
  };

  const deleteHall = async (id) => {
    if (window.confirm('Are you sure you want to delete this hall? This action cannot be undone.')) {
      try {
        await api.delete(`/halls/${id}`);
        toast.success('Hall deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete hall');
      }
    }
  };

  const openHallModal = (hall = null) => {
    if (hall) {
      setEditingHall(hall);
      setHallForm({
        name: hall.name,
        capacity: hall.capacity.toString(),
        location: hall.location,
        amenities: hall.amenities.join(', '),
        status: hall.status
      });
    } else {
      setEditingHall(null);
      setHallForm({ name: '', capacity: '', location: '', amenities: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-20">Loading admin dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 w-fit">
        {['overview', 'halls', 'bookings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 text-sm font-medium rounded-lg capitalize transition-all ${
              activeTab === tab ? 'bg-green-50 text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Bookings" value={stats.totalBookings} icon={<CalendarIcon className="text-blue-500" />} color="bg-blue-50" />
          <StatCard title="Seminar Halls" value={stats.totalHalls} icon={<Layout className="text-purple-500" />} color="bg-purple-50" />
          <StatCard title="Registered Users" value={stats.totalUsers} icon={<Users className="text-orange-500" />} color="bg-orange-50" />
          <StatCard title="Bookings Today" value={stats.bookingsToday} icon={<Activity className="text-green-500" />} color="bg-green-50" />
        </div>
      )}

      {/* Halls Management Tab */}
      {activeTab === 'halls' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Manage Seminar Halls</h2>
            <Button onClick={() => openHallModal()} className="flex items-center gap-2">
              <Plus size={16} /> Add New Hall
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b uppercase">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Capacity</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {halls.map(hall => (
                  <tr key={hall._id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900">{hall.name}</td>
                    <td className="p-4 text-gray-600">{hall.capacity}</td>
                    <td className="p-4 text-gray-600">{hall.location}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${hall.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hall.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-3">
                      <button onClick={() => openHallModal(hall)} className="text-blue-600 hover:text-blue-800"><Edit2 size={18} /></button>
                      <button onClick={() => deleteHall(hall._id)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">All Master Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b uppercase">
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Hall</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Purpose</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map(booking => (
                  <tr key={booking._id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{booking.user?.name || 'Deleted User'}</div>
                      <div className="text-xs text-gray-500">{booking.user?.email}</div>
                    </td>
                    <td className="p-4 text-gray-600">{booking.hall?.name || 'Deleted Hall'}</td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(booking.date).toLocaleDateString()}<br/>
                      <span className="font-medium">{booking.startTime} - {booking.endTime}</span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm max-w-xs truncate">{booking.purpose}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Hall Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">{editingHall ? 'Edit Seminar Hall' : 'Add New Seminar Hall'}</h2>
            <form onSubmit={handleHallSubmit} className="space-y-4">
              <Input label="Hall Name" required value={hallForm.name} onChange={e => setHallForm({...hallForm, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Capacity" type="number" required value={hallForm.capacity} onChange={e => setHallForm({...hallForm, capacity: e.target.value})} />
                <Input label="Location" required value={hallForm.location} onChange={e => setHallForm({...hallForm, location: e.target.value})} />
              </div>
              <Input label="Amenities (comma separated)" value={hallForm.amenities} onChange={e => setHallForm({...hallForm, amenities: e.target.value})} placeholder="Projector, AC, Wi-Fi" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-green-500 focus:border-green-500" value={hallForm.status} onChange={e => setHallForm({...hallForm, status: e.target.value})}>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="w-full" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="w-full">{editingHall ? 'Update' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      </div>
    </div>
  );
}
