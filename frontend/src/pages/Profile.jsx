import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: form.name, phone: form.phone };
      if (form.password) payload.password = form.password;
      const { data } = await api.put("/users/profile", payload);
      setUser(data.user);
      toast.success("Profile updated");
      setForm({ ...form, password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="eyebrow mb-2 text-center">Account</div>
      <h1 className="font-display text-3xl font-medium text-center mb-8">Your profile</h1>

      <form onSubmit={handleSubmit} className="plaque p-6 space-y-4">
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Email</label>
          <input type="email" className="input opacity-60" value={user?.email} disabled />
        </div>
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Full name</label>
          <input
            type="text"
            className="input"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Phone</label>
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">New password (optional)</label>
          <input
            type="password"
            className="input"
            placeholder="Leave blank to keep current password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
