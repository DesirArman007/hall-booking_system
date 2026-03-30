import { useState, useEffect } from 'react';
import { dummySeminarHalls } from '../utils/dummyData';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function BookingPage() {
  const { hallId } = useParams();
  const navigate = useNavigate();
  
  const [hall, setHall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    const fetchHallDetails = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          const foundHall = dummySeminarHalls.find(h => h._id === hallId) || dummySeminarHalls[0];
          setHall(foundHall);
          setLoading(false);
        }, 300);
      } catch (error) {
        toast.error('Failed to fetch hall details');
        navigate('/dashboard');
        setLoading(false);
      }
    };
    fetchHallDetails();
  }, [hallId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !purpose) {
      toast.error('Please fill in all fields');
      return;
    }

    if (startTime >= endTime) {
      toast.error('Start time must be before end time');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      toast.success('Booking confirmed successfully! (Dummy Data Mode)');
      navigate('/dashboard');
      setSubmitting(false);
    }, 800);
  };

  if (loading) return <div className="text-center py-12">Loading hall details...</div>;

  // Ensure minimum date is today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="border-b pb-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book {hall?.name}</h1>
          <p className="text-gray-500 flex items-center gap-2">
            Capacity: {hall?.capacity} | Location: {hall?.location}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Date of Event"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-6">
            <Input 
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input 
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Booking
            </label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500 transition-all duration-200"
              rows="3"
              placeholder="E.g., Department Meeting, Guest Lecture"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full py-3"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full py-3"
              disabled={submitting}
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
