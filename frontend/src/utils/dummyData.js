export const dummyUsers = [
  { _id: 'u1', name: 'Admin User', email: 'admin@schedulix.com', role: 'admin' },
  { _id: 'u2', name: 'John Doe', email: 'john@university.edu', role: 'user' },
  { _id: 'u3', name: 'Jane Smith', email: 'jane@university.edu', role: 'user' },
  { _id: 'u4', name: 'Dr. Alan Turing', email: 'turing@university.edu', role: 'user' },
  { _id: 'u5', name: 'Prof. Marie Curie', email: 'curie@university.edu', role: 'user' }
];

export const dummySeminarHalls = [
  { _id: 'h1', name: 'Turing Auditorium', capacity: 250, location: 'Computer Science Block, 1st Floor', amenities: ['Projector', 'Air Conditioning', 'Surround Sound', 'Wi-Fi', 'Podium'], status: 'active' },
  { _id: 'h2', name: 'Lovelace Seminar Hall', capacity: 100, location: 'Main Administrative Building, 3rd Floor', amenities: ['Projector', 'Whiteboard', 'Wi-Fi'], status: 'active' },
  { _id: 'h3', name: 'Newton Conference Room', capacity: 30, location: 'Physics Department, Ground Floor', amenities: ['Smart Board', 'Video Conferencing System', 'Coffee Machine'], status: 'active' },
  { _id: 'h4', name: 'Einstein Hall', capacity: 500, location: 'Central Campus Auditorium', amenities: ['Dual Projectors', 'Theatre Seating', 'Stage Lighting', 'Audio Desk'], status: 'maintenance' },
  { _id: 'h5', name: 'Curie Lab Seminar Room', capacity: 60, location: 'Chemistry Block, 2nd Floor', amenities: ['Whiteboard', 'Display Monitor'], status: 'active' }
];

const getDate = (dayOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0]; // Returns as 'YYYY-MM-DD' for easy matching on frontend
};

export const dummyBookings = [
  { _id: 'b1', user: 'u2', hall: 'h1', date: getDate(-10), startTime: '09:00', endTime: '11:00', purpose: 'Annual Department Orientation for First-Year Students', status: 'confirmed' },
  { _id: 'b2', user: 'u3', hall: 'h2', date: getDate(-7), startTime: '14:00', endTime: '16:00', purpose: 'Research Paper Presentation – Machine Learning Trends 2025', status: 'confirmed' },
  { _id: 'b3', user: 'u4', hall: 'h3', date: getDate(-5), startTime: '10:00', endTime: '12:00', purpose: 'Faculty Research Committee Meeting', status: 'confirmed' },
  { _id: 'b4', user: 'u5', hall: 'h5', date: getDate(-3), startTime: '13:00', endTime: '15:00', purpose: 'Chemistry Lab Safety Workshop', status: 'cancelled' },
  { _id: 'b5', user: 'u2', hall: 'h3', date: getDate(-2), startTime: '11:00', endTime: '12:00', purpose: 'Project Advisor Meeting – Final Year Students', status: 'confirmed' },
  
  // Today's bookings
  { _id: 'b6', user: 'u3', hall: 'h1', date: getDate(0), startTime: '09:00', endTime: '11:30', purpose: 'Guest Lecture: Industry 4.0 and the Future of Work', status: 'confirmed' },
  { _id: 'b7', user: 'u4', hall: 'h2', date: getDate(0), startTime: '14:00', endTime: '16:00', purpose: 'Postgraduate Student Thesis Defense Panel', status: 'confirmed' },
  
  // Upcoming bookings
  { _id: 'b8', user: 'u5', hall: 'h2', date: getDate(2), startTime: '10:00', endTime: '12:00', purpose: 'Inter-Department Collaboration Workshop', status: 'confirmed' },
  { _id: 'b9', user: 'u1', hall: 'h1', date: getDate(3), startTime: '09:00', endTime: '17:00', purpose: 'Annual University Convocation Ceremony', status: 'confirmed' },
  { _id: 'b10', user: 'u2', hall: 'h5', date: getDate(4), startTime: '15:00', endTime: '17:00', purpose: 'Software Engineering Workshop – Agile Methodologies', status: 'confirmed' },
  { _id: 'b11', user: 'u3', hall: 'h3', date: getDate(5), startTime: '11:00', endTime: '13:00', purpose: "International Students' Cultural Meet", status: 'confirmed' },
  { _id: 'b12', user: 'u4', hall: 'h1', date: getDate(7), startTime: '10:00', endTime: '13:00', purpose: 'National Science Day Seminar & Exhibition', status: 'confirmed' },
  { _id: 'b13', user: 'u5', hall: 'h3', date: getDate(8), startTime: '14:00', endTime: '15:30', purpose: 'Innovation Cell Planning Session', status: 'confirmed' },
  { _id: 'b14', user: 'u2', hall: 'h2', date: getDate(10), startTime: '09:00', endTime: '11:00', purpose: 'Placement Drive Orientation – Final Year Students', status: 'confirmed' },
  { _id: 'b15', user: 'u3', hall: 'h5', date: getDate(12), startTime: '13:00', endTime: '16:00', purpose: 'Women in STEM Leadership Summit', status: 'confirmed' }
];
