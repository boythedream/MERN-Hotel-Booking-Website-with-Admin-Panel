import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Room from "./models/Room.js";
import Booking from "./models/Booking.js";

dotenv.config();
connectDB();

const users = [
  { name: "Admin User", email: "admin@hotel.com", password: "admin123", role: "admin" },
  { name: "Jane Guest", email: "guest@hotel.com", password: "guest123", role: "user" },
];

const rooms = [
  {
    name: "Harborview Standard",
    roomNumber: "101",
    category: "Standard",
    description: "A cozy room with partial harbor views, perfect for solo travelers or couples on a budget.",
    pricePerNight: 89,
    capacity: 2,
    beds: "1 Queen Bed",
    size: 24,
    amenities: ["Free Wi-Fi", "Air Conditioning", "TV", "Work Desk"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"],
    floor: 1,
  },
  {
    name: "Garden Deluxe",
    roomNumber: "205",
    category: "Deluxe",
    description: "Spacious room overlooking the courtyard garden, with a plush king bed and a reading nook.",
    pricePerNight: 149,
    capacity: 3,
    beds: "1 King Bed",
    size: 32,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "TV", "Balcony"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"],
    floor: 2,
  },
  {
    name: "Skyline Suite",
    roomNumber: "412",
    category: "Suite",
    description: "A two-room suite with panoramic skyline views, separate living area, and a soaking tub.",
    pricePerNight: 279,
    capacity: 4,
    beds: "1 King Bed + 1 Sofa Bed",
    size: 55,
    amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Smart TV", "Soaking Tub", "Living Area"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"],
    floor: 4,
  },
  {
    name: "Executive Corner",
    roomNumber: "508",
    category: "Executive",
    description: "Corner room with wraparound windows, executive lounge access, and a dedicated workspace.",
    pricePerNight: 219,
    capacity: 2,
    beds: "1 King Bed",
    size: 40,
    amenities: ["Free Wi-Fi", "Lounge Access", "Espresso Machine", "Smart TV", "Work Desk"],
    images: ["https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800"],
    floor: 5,
  },
  {
    name: "The Presidential Retreat",
    roomNumber: "701",
    category: "Presidential",
    description: "The hotel's flagship suite: private terrace, dining room, and dedicated butler service.",
    pricePerNight: 599,
    capacity: 6,
    beds: "2 King Beds",
    size: 110,
    amenities: ["Private Terrace", "Butler Service", "Dining Room", "Jacuzzi", "Smart Home Controls"],
    images: ["https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800"],
    floor: 7,
  },
  {
    name: "Poolside Deluxe",
    roomNumber: "118",
    category: "Deluxe",
    description: "Ground floor room with direct pool access and a private sun terrace.",
    pricePerNight: 159,
    capacity: 3,
    beds: "2 Double Beds",
    size: 34,
    amenities: ["Free Wi-Fi", "Pool Access", "Air Conditioning", "TV", "Terrace"],
    images: ["https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"],
    floor: 1,
  },
];

const importData = async () => {
  try {
    await Booking.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();

    await User.create(users);
    await Room.insertMany(rooms);

    console.log("Data imported successfully!");
    console.log("Admin login: admin@hotel.com / admin123");
    console.log("Guest login: guest@hotel.com / guest123");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Booking.deleteMany();
    await Room.deleteMany();
    await User.deleteMany();
    console.log("Data destroyed!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
