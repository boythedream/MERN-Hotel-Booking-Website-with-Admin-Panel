import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiWifi, FiCoffee, FiKey } from "react-icons/fi";
import api from "../api/axios.js";
import RoomCard from "../components/RoomCard.jsx";
import Loader from "../components/Loader.jsx";

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await api.get("/rooms?sort=price-desc");
        setRooms(data.rooms.slice(0, 3));
      } catch {
        // silently ignore for the homepage preview
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-ink-900 text-paper-soft overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <div className="eyebrow text-brass-light mb-6">Est. Room 101 — Room 701</div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
              A room number,
              <br />
              not a room type.
            </h1>
            <p className="text-paper-soft/70 text-lg leading-relaxed mb-10 max-w-md">
              Seven floors, six room styles, one standard: every stay at Meridian House
              is booked, confirmed, and keyed to you alone.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rooms" className="btn-primary bg-brass hover:bg-brass-dark text-ink-900">
                Browse rooms <FiArrowRight />
              </Link>
              <Link to="/rooms" className="btn-secondary border-paper-soft/40 text-paper-soft hover:bg-paper-soft hover:text-ink-900">
                Check availability
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden border border-paper-soft/10">
              <img
                src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900"
                alt="Meridian House suite interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brass text-ink-900 px-5 py-4 rounded-sm shadow-xl hidden sm:block">
              <div className="font-mono text-xs tracking-widest mb-1">NO. 412</div>
              <div className="font-display text-lg">Skyline Suite</div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities strip */}
      <section className="border-b border-ink-900/10">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <FiWifi className="text-brass-dark text-xl" />
            <span className="text-sm">Complimentary Wi-Fi in every room</span>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <FiCoffee className="text-brass-dark text-xl" />
            <span className="text-sm">In-room espresso, from Deluxe up</span>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <FiKey className="text-brass-dark text-xl" />
            <span className="text-sm">Instant confirmation, no front-desk wait</span>
          </div>
        </div>
      </section>

      {/* Featured rooms */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-2">Featured</div>
            <h2 className="font-display text-3xl font-medium">Our finest rooms</h2>
          </div>
          <Link to="/rooms" className="text-sm font-medium text-brass-dark hidden sm:flex items-center gap-1">
            View all rooms <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <Loader label="Setting the table" />
        ) : rooms.length === 0 ? (
          <p className="text-ink-900/60 text-sm">
            No rooms yet — run the seeder or add rooms from the admin dashboard.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-paper-dim">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
            Your key is waiting at Room —
          </h2>
          <p className="text-ink-900/60 mb-8 max-w-lg mx-auto">
            Pick your dates, pick your number, and we'll have the room ready before you arrive.
          </p>
          <Link to="/rooms" className="btn-primary">
            Find your room <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
