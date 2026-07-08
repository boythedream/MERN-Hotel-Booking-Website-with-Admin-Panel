import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const statusColor = {
  pending: "bg-brass/20 text-brass-dark",
  confirmed: "bg-moss/20 text-moss",
  cancelled: "bg-clay/20 text-clay",
  completed: "bg-ink-900/10 text-ink-900/70",
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data.bookings);
    } catch {
      toast.error("Could not load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel booking");
    }
  };

  if (loading) return <Loader label="Pulling your reservations" />;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="eyebrow mb-2">Your stays</div>
      <h1 className="font-display text-4xl font-medium mb-10">My bookings</h1>

      {bookings.length === 0 ? (
        <div className="plaque p-10 text-center">
          <p className="text-ink-900/60 mb-4">You haven't booked a room yet.</p>
          <Link to="/rooms" className="btn-primary">Browse rooms</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="plaque p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
              <img
                src={b.room?.images?.[0] || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400"}
                alt={b.room?.name}
                className="w-full sm:w-32 h-24 object-cover rounded-sm"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-ink-900/50">NO. {b.room?.roomNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-sm ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <h3 className="font-display text-lg font-medium mb-1">{b.room?.name}</h3>
                <p className="text-sm text-ink-900/60">
                  {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                  {" · "}{b.nights} night{b.nights > 1 ? "s" : ""} · ${b.totalPrice}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                {b.paymentStatus === "unpaid" && b.status !== "cancelled" && (
                  <Link to={`/checkout/${b._id}`} className="btn-primary !px-4 !py-2 text-sm">
                    Pay now
                  </Link>
                )}
                {["pending", "confirmed"].includes(b.status) && (
                  <button
                    onClick={() => handleCancel(b._id)}
                    className="text-xs text-clay hover:underline"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
