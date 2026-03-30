export const DUMMY_HALLS = [
  {
    _id: 'hall1',
    name: 'Turing Auditorium',
    capacity: 250,
    location: 'Computer Science Block, 1st Floor',
    amenities: ['Projector', 'Air Conditioning', 'Surround Sound', 'Wi-Fi', 'Podium'],
    status: 'active'
  },
  {
    _id: 'hall2',
    name: 'Lovelace Seminar Hall',
    capacity: 100,
    location: 'Main Administrative Building, 3rd Floor',
    amenities: ['Projector', 'Whiteboard', 'Wi-Fi'],
    status: 'active'
  },
  {
    _id: 'hall3',
    name: 'Newton Conference Room',
    capacity: 30,
    location: 'Physics Department, Ground Floor',
    amenities: ['Smart Board', 'Video Conferencing System', 'Coffee Machine'],
    status: 'active'
  },
  {
    _id: 'hall4',
    name: 'Einstein Hall',
    capacity: 500,
    location: 'Central Campus Auditorium',
    amenities: ['Dual Projectors', 'Theatre Seating', 'Stage Lighting', 'Audio Desk'],
    status: 'maintenance'
  },
  {
    _id: 'hall5',
    name: 'Curie Lab Seminar Room',
    capacity: 60,
    location: 'Chemistry Block, 2nd Floor',
    amenities: ['Whiteboard', 'Display Monitor'],
    status: 'active'
  }
];

export const DUMMY_BOOKINGS = [
  {
    _id: 'book1',
    user: { name: 'John Doe', email: 'john@example.com' },
    hall: DUMMY_HALLS[0],
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Machine Learning Workshop',
    status: 'confirmed'
  },
  {
    _id: 'book2',
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    hall: DUMMY_HALLS[1],
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Faculty Meeting',
    status: 'confirmed'
  }
];

export const DUMMY_STATS = {
  totalBookings: 156,
  totalHalls: 5,
  totalUsers: 42,
  bookingsToday: 3,
};
