import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import AdminNav from "../../components/AdminNav.jsx";
import Loader from "../../components/Loader.jsx";

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

const statusColor = {
  pending: "bg-brass/20 text-brass-dark",
  confirmed: "bg-moss/20 text-moss",
  cancelled: "bg-clay/20 text-clay",
  completed: "bg-ink-900/10 text-ink-900/70",
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookings", { params: filter ? { status: filter } : {} });
      setBookings(data.bookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success("Status updated");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="eyebrow mb-2">Back office</div>
      <h1 className="font-display text-4xl font-medium mb-10">Manage bookings</h1>
      <AdminNav />

      <div className="flex gap-2 mb-6">
        {["", ...statusOptions].map((s) => (
          <button
            key={s || "all"}
            onClick={() => setFilter(s)}
            className={`text-xs font-mono uppercase tracking-wider px-3 py-2 rounded-sm border transition-colors ${
              filter === s
                ? "bg-ink-900 text-paper-soft border-ink-900"
                : "border-ink-900/20 text-ink-900/70 hover:border-ink-900/50"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Fetching reservations" />
      ) : bookings.length === 0 ? (
        <p className="text-ink-900/60">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto plaque">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ink-900/10 text-ink-900/50 font-mono text-xs uppercase">
                <th className="p-4">Guest</th>
                <th className="p-4">Room</th>
                <th className="p-4">Dates</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-ink-900/5 last:border-0">
                  <td className="p-4">
                    <div className="font-medium">{b.user?.name}</div>
                    <div className="text-xs text-ink-900/50">{b.user?.email}</div>
                  </td>
                  <td className="p-4 font-mono">No. {b.room?.roomNumber}</td>
                  <td className="p-4 text-xs">
                    {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                  </td>
                  <td className="p-4">${b.totalPrice}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${b.paymentStatus === "paid" ? "bg-moss/20 text-moss" : "bg-ink-900/10 text-ink-900/60"}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-sm border-0 ${statusColor[b.status]}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
