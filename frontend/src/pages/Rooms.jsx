import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import RoomCard from "../components/RoomCard.jsx";
import Loader from "../components/Loader.jsx";

const categories = ["All", "Standard", "Deluxe", "Suite", "Executive", "Presidential"];

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [maxPrice, setMaxPrice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category !== "All") params.category = category;
        if (maxPrice) params.maxPrice = maxPrice;
        if (search) params.search = search;
        const { data } = await api.get("/rooms", { params });
        setRooms(data.rooms);
      } catch {
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };
    const timeout = setTimeout(fetchRooms, 300);
    return () => clearTimeout(timeout);
  }, [category, maxPrice, search]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setSearchParams(cat === "All" ? {} : { category: cat });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10">
        <div className="eyebrow mb-2">Directory</div>
        <h1 className="font-display text-4xl font-medium mb-3">All rooms</h1>
        <p className="text-ink-900/60 max-w-lg">
          Every room, numbered and catalogued. Filter by style or search for what you need.
        </p>
      </div>

      {/* Filters */}
      <div className="plaque p-5 mb-10 flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input md:max-w-xs"
        />
        <input
          type="number"
          placeholder="Max price / night"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input md:max-w-[180px]"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-sm border transition-colors ${
                category === cat
                  ? "bg-ink-900 text-paper-soft border-ink-900"
                  : "border-ink-900/20 text-ink-900/70 hover:border-ink-900/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader label="Pulling the directory" />
      ) : rooms.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink-900/60">No rooms match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
