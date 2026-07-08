import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import api from "../../api/axios.js";
import AdminNav from "../../components/AdminNav.jsx";
import Loader from "../../components/Loader.jsx";

const emptyForm = {
  name: "",
  roomNumber: "",
  category: "Standard",
  description: "",
  pricePerNight: "",
  capacity: 2,
  beds: "1 Queen Bed",
  size: 30,
  amenities: "",
  images: "",
  floor: 1,
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/rooms");
      setRooms(data.rooms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (room) => {
    setForm({
      ...room,
      amenities: room.amenities?.join(", ") || "",
      images: room.images?.join(", ") || "",
    });
    setEditingId(room._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        pricePerNight: Number(form.pricePerNight),
        capacity: Number(form.capacity),
        size: Number(form.size),
        floor: Number(form.floor),
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        images: form.images.split(",").map((i) => i.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.put(`/rooms/${editingId}`, payload);
        toast.success("Room updated");
      } else {
        await api.post("/rooms", payload);
        toast.success("Room created");
      }
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save room");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room permanently?")) return;
    try {
      await api.delete(`/rooms/${id}`);
      toast.success("Room deleted");
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete room");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="eyebrow mb-2">Back office</div>
      <h1 className="font-display text-4xl font-medium mb-10">Manage rooms</h1>
      <AdminNav />

      <div className="flex justify-end mb-6">
        <button onClick={openCreate} className="btn-primary !px-4 !py-2 text-sm">
          <FiPlus /> Add room
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-ink-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-paper-soft rounded-sm max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-ink-900/50 hover:text-ink-900"
            >
              <FiX size={20} />
            </button>
            <h2 className="font-display text-2xl font-medium mb-6">
              {editingId ? "Edit room" : "New room"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <input className="input col-span-2" placeholder="Room name" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className="input" placeholder="Room number" required
                value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
              <select className="input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {["Standard", "Deluxe", "Suite", "Executive", "Presidential"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <textarea className="input col-span-2" placeholder="Description" rows={2} required
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <input type="number" className="input" placeholder="Price / night" required
                value={form.pricePerNight} onChange={(e) => setForm({ ...form, pricePerNight: e.target.value })} />
              <input type="number" className="input" placeholder="Capacity" required
                value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
              <input className="input" placeholder="Beds (e.g. 1 King Bed)"
                value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} />
              <input type="number" className="input" placeholder="Size (m²)"
                value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} />
              <input type="number" className="input" placeholder="Floor"
                value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })} />
              <input className="input col-span-2" placeholder="Amenities, comma-separated"
                value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
              <input className="input col-span-2" placeholder="Image URLs, comma-separated"
                value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
              <button type="submit" disabled={saving} className="btn-primary col-span-2 disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Update room" : "Create room"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Loader label="Fetching the ledger" />
      ) : (
        <div className="overflow-x-auto plaque">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ink-900/10 text-ink-900/50 font-mono text-xs uppercase">
                <th className="p-4">No.</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Capacity</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-ink-900/5 last:border-0">
                  <td className="p-4 font-mono">{room.roomNumber}</td>
                  <td className="p-4 font-medium">{room.name}</td>
                  <td className="p-4">{room.category}</td>
                  <td className="p-4">${room.pricePerNight}</td>
                  <td className="p-4">{room.capacity}</td>
                  <td className="p-4">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => openEdit(room)} className="text-ink-900/60 hover:text-brass-dark">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleDelete(room._id)} className="text-ink-900/60 hover:text-clay">
                        <FiTrash2 />
                      </button>
                    </div>
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

export default ManageRooms;
