import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-ink-900 text-paper-soft mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl mb-3">Meridian House</div>
          <p className="text-sm text-paper-soft/70 leading-relaxed">
            A boutique hotel where every room carries its own number, its own view,
            its own quiet.
          </p>
        </div>
        <div>
          <div className="eyebrow text-brass-light mb-4">Explore</div>
          <ul className="space-y-2 text-sm text-paper-soft/80">
            <li><Link to="/rooms" className="hover:text-brass-light">All Rooms</Link></li>
            <li><Link to="/rooms?category=Suite" className="hover:text-brass-light">Suites</Link></li>
            <li><Link to="/rooms?category=Deluxe" className="hover:text-brass-light">Deluxe Rooms</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-brass-light mb-4">Guest</div>
          <ul className="space-y-2 text-sm text-paper-soft/80">
            <li><Link to="/my-bookings" className="hover:text-brass-light">My Bookings</Link></li>
            <li><Link to="/profile" className="hover:text-brass-light">Profile</Link></li>
          </ul>
        </div>
        <div>
          <div className="eyebrow text-brass-light mb-4">Contact</div>
          <ul className="space-y-2 text-sm text-paper-soft/80">
            <li>12 Harbor Row, Karachi</li>
            <li>reception@meridianhouse.example</li>
            <li>+92 21 0000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper-soft/10 py-6 text-center text-xs text-paper-soft/50 font-mono">
        © {new Date().getFullYear()} MERIDIAN HOUSE — ROOM 101–701
      </div>
    </footer>
  );
};

export default Footer;
