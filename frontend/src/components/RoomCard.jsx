import { Link } from "react-router-dom";
import { FiUsers, FiMaximize } from "react-icons/fi";

const RoomCard = ({ room }) => {
  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block plaque overflow-hidden hover:border-brass/50 transition-colors"
    >
      <div className="relative h-56 overflow-hidden bg-ink-100">
        <img
          src={room.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800"}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-ink-900/85 text-paper-soft font-mono text-xs px-2.5 py-1 rounded-sm tracking-widest">
          NO. {room.roomNumber}
        </div>
      </div>
      <div className="p-5">
        <div className="eyebrow mb-1">{room.category}</div>
        <h3 className="font-display text-xl font-medium text-ink-900 mb-2">{room.name}</h3>
        <p className="text-sm text-ink-900/60 line-clamp-2 mb-4">{room.description}</p>
        <div className="flex items-center gap-4 text-xs text-ink-900/60 font-mono mb-4">
          <span className="flex items-center gap-1"><FiUsers /> {room.capacity} guests</span>
          <span className="flex items-center gap-1"><FiMaximize /> {room.size} m²</span>
        </div>
        <div className="hairline pt-4 flex items-center justify-between">
          <div>
            <span className="font-display text-2xl text-ink-900">${room.pricePerNight}</span>
            <span className="text-xs text-ink-900/50"> / night</span>
          </div>
          <span className="text-sm font-medium text-brass-dark group-hover:translate-x-1 transition-transform">
            View room →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;
