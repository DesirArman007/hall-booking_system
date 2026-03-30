require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const SeminarHall = require('./models/SeminarHall');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Booking.deleteMany();
    await User.deleteMany();
    await SeminarHall.deleteMany();

    console.log('Database cleared.');

    // 1. Create Admin & Demo Users
    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@schedulix.com',
        password: 'password123',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@university.edu',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@university.edu',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Dr. Alan Turing',
        email: 'turing@university.edu',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Prof. Marie Curie',
        email: 'curie@university.edu',
        password: 'password123',
        role: 'user'
      }
    ]);

    // Workaround for insertMany bypassing Mongoose pre('save') hooks:
    for (let i = 0; i < createdUsers.length; i++) {
        const user = await User.findById(createdUsers[i]._id);
        user.password = 'password123';
        await user.save(); // triggers bcrypt hash
    }
    console.log('Users seeded.');

    // 2. Create Seminar Halls
    const createdHalls = await SeminarHall.insertMany([
      {
        name: 'Turing Auditorium',
        capacity: 250,
        location: 'Computer Science Block, 1st Floor',
        amenities: ['Projector', 'Air Conditioning', 'Surround Sound', 'Wi-Fi', 'Podium'],
        status: 'active'
      },
      {
        name: 'Lovelace Seminar Hall',
        capacity: 100,
        location: 'Main Administrative Building, 3rd Floor',
        amenities: ['Projector', 'Whiteboard', 'Wi-Fi'],
        status: 'active'
      },
      {
        name: 'Newton Conference Room',
        capacity: 30,
        location: 'Physics Department, Ground Floor',
        amenities: ['Smart Board', 'Video Conferencing System', 'Coffee Machine'],
        status: 'active'
      },
      {
        name: 'Einstein Hall',
        capacity: 500,
        location: 'Central Campus Auditorium',
        amenities: ['Dual Projectors', 'Theatre Seating', 'Stage Lighting', 'Audio Desk'],
        status: 'maintenance'
      },
      {
        name: 'Curie Lab Seminar Room',
        capacity: 60,
        location: 'Chemistry Block, 2nd Floor',
        amenities: ['Whiteboard', 'Display Monitor'],
        status: 'active'
      }
    ]);

    console.log('Seminar Halls seeded.');

    // Helper to get a date relative to today
    const getDate = (dayOffset) => {
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      d.setHours(0, 0, 0, 0);
      return d;
    };

    // 3. Create Bookings
    // Users: [admin, john, jane, turing, curie]
    // Halls: [Turing Aud, Lovelace, Newton, Einstein, Curie]
    await Booking.insertMany([
      // Past bookings
      {
        user: createdUsers[1]._id,  // John
        hall: createdHalls[0]._id,  // Turing Auditorium
        date: getDate(-10),
        startTime: '09:00',
        endTime: '11:00',
        purpose: 'Annual Department Orientation for First-Year Students',
        status: 'confirmed'
      },
      {
        user: createdUsers[2]._id,  // Jane
        hall: createdHalls[1]._id,  // Lovelace
        date: getDate(-7),
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'Research Paper Presentation – Machine Learning Trends 2025',
        status: 'confirmed'
      },
      {
        user: createdUsers[3]._id,  // Turing
        hall: createdHalls[2]._id,  // Newton Conference Room
        date: getDate(-5),
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Faculty Research Committee Meeting',
        status: 'confirmed'
      },
      {
        user: createdUsers[4]._id,  // Curie
        hall: createdHalls[4]._id,  // Curie Lab
        date: getDate(-3),
        startTime: '13:00',
        endTime: '15:00',
        purpose: 'Chemistry Lab Safety Workshop',
        status: 'cancelled'
      },
      {
        user: createdUsers[1]._id,  // John
        hall: createdHalls[2]._id,  // Newton Conference Room
        date: getDate(-2),
        startTime: '11:00',
        endTime: '12:00',
        purpose: 'Project Advisor Meeting – Final Year Students',
        status: 'confirmed'
      },

      // Today's bookings
      {
        user: createdUsers[2]._id,  // Jane
        hall: createdHalls[0]._id,  // Turing Auditorium
        date: getDate(0),
        startTime: '09:00',
        endTime: '11:30',
        purpose: 'Guest Lecture: Industry 4.0 and the Future of Work',
        status: 'confirmed'
      },
      {
        user: createdUsers[3]._id,  // Turing
        hall: createdHalls[1]._id,  // Lovelace
        date: getDate(0),
        startTime: '14:00',
        endTime: '16:00',
        purpose: 'Postgraduate Student Thesis Defense Panel',
        status: 'confirmed'
      },

      // Upcoming bookings
      {
        user: createdUsers[4]._id,  // Curie
        hall: createdHalls[1]._id,  // Lovelace
        date: getDate(2),
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Inter-Department Collaboration Workshop',
        status: 'confirmed'
      },
      {
        user: createdUsers[0]._id,  // Admin
        hall: createdHalls[0]._id,  // Turing Auditorium
        date: getDate(3),
        startTime: '09:00',
        endTime: '17:00',
        purpose: 'Annual University Convocation Ceremony',
        status: 'confirmed'
      },
      {
        user: createdUsers[1]._id,  // John
        hall: createdHalls[4]._id,  // Curie Lab
        date: getDate(4),
        startTime: '15:00',
        endTime: '17:00',
        purpose: 'Software Engineering Workshop – Agile Methodologies',
        status: 'confirmed'
      },
      {
        user: createdUsers[2]._id,  // Jane
        hall: createdHalls[2]._id,  // Newton Conference Room
        date: getDate(5),
        startTime: '11:00',
        endTime: '13:00',
        purpose: "International Students' Cultural Meet",
        status: 'confirmed'
      },
      {
        user: createdUsers[3]._id,  // Turing
        hall: createdHalls[0]._id,  // Turing Auditorium
        date: getDate(7),
        startTime: '10:00',
        endTime: '13:00',
        purpose: 'National Science Day Seminar & Exhibition',
        status: 'confirmed'
      },
      {
        user: createdUsers[4]._id,  // Curie
        hall: createdHalls[2]._id,  // Newton Conference Room
        date: getDate(8),
        startTime: '14:00',
        endTime: '15:30',
        purpose: 'Innovation Cell Planning Session',
        status: 'confirmed'
      },
      {
        user: createdUsers[1]._id,  // John
        hall: createdHalls[1]._id,  // Lovelace
        date: getDate(10),
        startTime: '09:00',
        endTime: '11:00',
        purpose: 'Placement Drive Orientation – Final Year Students',
        status: 'confirmed'
      },
      {
        user: createdUsers[2]._id,  // Jane
        hall: createdHalls[4]._id,  // Curie Lab
        date: getDate(12),
        startTime: '13:00',
        endTime: '16:00',
        purpose: 'Women in STEM Leadership Summit',
        status: 'confirmed'
      }
    ]);

    console.log('Bookings seeded.');
    console.log('\n✅ Dummy data insertion complete!');
    console.log('\n--- Login Credentials ---');
    console.log('Admin  : admin@schedulix.com  / password123');
    console.log('Faculty: john@university.edu  / password123');
    console.log('Faculty: jane@university.edu  / password123');
    console.log('Faculty: turing@university.edu / password123');
    console.log('Faculty: curie@university.edu  / password123');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
