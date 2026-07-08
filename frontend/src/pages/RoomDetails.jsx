import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUsers, FiMaximize, FiCheck } from "react-icons/fi";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const today = new Date().toISOString().split("T")[0];

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    specialRequests: "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await api.get(`/rooms/${id}`);
        setRoom(data.room);
      } catch {
        toast.error("Room not found");
        navigate("/rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id, navigate]);

  const nights =
    form.checkIn && form.checkOut
      ? Math.max(
          0,
          Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24))
        )
      : 0;
  const total = room ? nights * room.pricePerNight : 0;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBook = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to book a room");
      navigate("/login", { state: { from: { pathname: `/rooms/${id}` } } });
      return;
    }
    if (!form.checkIn || !form.checkOut || nights <= 0) {
      toast.error("Please select valid check-in and check-out dates");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await api.post("/bookings", {
        roomId: room._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
        guestDetails: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          specialRequests: form.specialRequests,
        },
      });
      toast.success("Room reserved — continue to payment");
      navigate(`/checkout/${data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not complete booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Reading the plaque" />;
  if (!room) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="grid lg:grid-cols-5 gap-12">
        {/* Left: details */}
        <div className="lg:col-span-3">
          <div className="rounded-sm overflow-hidden mb-6 border border-ink-900/10">
            <img
              src={room.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000"}
              alt={room.name}
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-xs bg-ink-900 text-paper-soft px-2.5 py-1 rounded-sm tracking-widest">
              NO. {room.roomNumber}
            </span>
            <span className="eyebrow">{room.category}</span>
          </div>
          <h1 className="font-display text-4xl font-medium mb-4">{room.name}</h1>
          <p className="text-ink-900/70 leading-relaxed mb-8">{room.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="plaque p-4 text-center">
              <FiUsers className="mx-auto mb-1 text-brass-dark" />
              <div className="text-sm font-medium">{room.capacity} guests</div>
            </div>
            <div className="plaque p-4 text-center">
              <FiMaximize className="mx-auto mb-1 text-brass-dark" />
              <div className="text-sm font-medium">{room.size} m²</div>
            </div>
            <div className="plaque p-4 text-center col-span-2 sm:col-span-2">
              <div className="text-sm font-medium">{room.beds}</div>
            </div>
          </div>

          <div className="mb-8">
            <div className="eyebrow mb-3">Amenities</div>
            <ul className="grid grid-cols-2 gap-2">
              {room.amenities?.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm text-ink-900/80">
                  <FiCheck className="text-moss shrink-0" /> {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: booking form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleBook} className="plaque p-6 sticky top-28">
            <div className="flex items-baseline justify-between mb-6">
              <span className="font-display text-2xl">${room.pricePerNight}</span>
              <span className="text-xs text-ink-900/50">per night</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-ink-900/60 mb-1 block">Check-in</label>
                <input
                  type="date"
                  name="checkIn"
                  min={today}
                  value={form.checkIn}
                  onChange={handleChange}
                  className="input text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-ink-900/60 mb-1 block">Check-out</label>
                <input
                  type="date"
                  name="checkOut"
                  min={form.checkIn || today}
                  value={form.checkOut}
                  onChange={handleChange}
                  className="input text-sm"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-xs text-ink-900/60 mb-1 block">Guests</label>
              <input
                type="number"
                name="guests"
                min={1}
                max={room.capacity}
                value={form.guests}
                onChange={handleChange}
                className="input text-sm"
              />
            </div>

            <div className="hairline my-4" />

            <div className="mb-3">
              <label className="text-xs text-ink-900/60 mb-1 block">Full name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input text-sm"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-ink-900/60 mb-1 block">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-ink-900/60 mb-1 block">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="input text-sm"
                  required
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="text-xs text-ink-900/60 mb-1 block">Special requests (optional)</label>
              <textarea
                name="specialRequests"
                value={form.specialRequests}
                onChange={handleChange}
                rows={2}
                className="input text-sm resize-none"
              />
            </div>

            {nights > 0 && (
              <div className="hairline pt-4 mb-5 text-sm space-y-1">
                <div className="flex justify-between text-ink-900/70">
                  <span>${room.pricePerNight} × {nights} night{nights > 1 ? "s" : ""}</span>
                  <span>${total}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-1">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? "Reserving..." : "Reserve room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
