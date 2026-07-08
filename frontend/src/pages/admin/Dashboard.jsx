import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import AdminNav from "../../components/AdminNav.jsx";
import Loader from "../../components/Loader.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [roomsRes, bookingsRes, usersRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/bookings"),
          api.get("/users"),
        ]);

        const bookings = bookingsRes.data.bookings;
        const revenue = bookings
          .filter((b) => b.paymentStatus === "paid")
          .reduce((sum, b) => sum + b.totalPrice, 0);

        setStats({
          totalRooms: roomsRes.data.count,
          totalBookings: bookingsRes.data.count,
          totalUsers: usersRes.data.count,
          pending: bookings.filter((b) => b.status === "pending").length,
          confirmed: bookings.filter((b) => b.status === "confirmed").length,
          revenue,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="eyebrow mb-2">Back office</div>
      <h1 className="font-display text-4xl font-medium mb-10">Dashboard</h1>
      <AdminNav />

      {loading ? (
        <Loader label="Tallying the ledger" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { label: "Total Rooms", value: stats.totalRooms },
            { label: "Total Bookings", value: stats.totalBookings },
            { label: "Registered Guests", value: stats.totalUsers },
            { label: "Pending Bookings", value: stats.pending },
            { label: "Confirmed Bookings", value: stats.confirmed },
            { label: "Revenue Collected", value: `$${stats.revenue}` },
          ].map((s) => (
            <div key={s.label} className="plaque p-6">
              <div className="font-display text-3xl mb-1">{s.value}</div>
              <div className="eyebrow">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
