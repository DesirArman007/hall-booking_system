import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ShieldCheck, Clock, MapPin, Users } from 'lucide-react';
import { dummySeminarHalls } from '../utils/dummyData';

export default function Home() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      setHalls(dummySeminarHalls);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-16 py-8">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 rounded-full shadow-sm">
            <Calendar className="w-14 h-14 text-green-600" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Smart Seminar Hall<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
            Booking System
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Check real-time availability and book seminar halls instantly. 
          Use the login button at the top right to manage your bookings.
        </p>
      </div>

      {/* Available Halls Section */}
      <div className="w-full max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Available Seminar Halls</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-500">Loading halls...</div>
        ) : (
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
                No seminar halls found in the database.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mt-8 px-4 text-left border-t pt-16">
        <FeatureCard 
          icon={<Clock className="w-8 h-8 text-blue-500" />}
          title="Real-time Availability"
          description="View instant availability of all seminar halls across the campus and never double-book again."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
          title="Smart Conflict Resolution"
          description="Our algorithm ensures that strict time constraints are met to prevent overlapping schedules completely."
        />
        <FeatureCard 
          icon={<Calendar className="w-8 h-8 text-purple-500" />}
          title="Seamless Management"
          description="Administrators get full control over halls, bookings, and powerful usage statistics."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4 bg-gray-50 w-14 h-14 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}
