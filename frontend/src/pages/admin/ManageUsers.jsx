import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import api from "../../api/axios.js";
import { useAuth } from "../../context/AuthContext.jsx";
import AdminNav from "../../components/AdminNav.jsx";
import Loader from "../../components/Loader.jsx";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success("Role updated");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update role");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("User removed");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove user");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="eyebrow mb-2">Back office</div>
      <h1 className="font-display text-4xl font-medium mb-10">Manage guests & staff</h1>
      <AdminNav />

      {loading ? (
        <Loader label="Checking the guest book" />
      ) : (
        <div className="overflow-x-auto plaque">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-ink-900/10 text-ink-900/50 font-mono text-xs uppercase">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-ink-900/5 last:border-0">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-ink-900/70">{u.email}</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u._id === currentUser?._id}
                      className="input !py-1.5 !px-2 text-xs w-28 disabled:opacity-50"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    {u._id !== currentUser?._id && (
                      <button onClick={() => handleDelete(u._id)} className="text-ink-900/60 hover:text-clay">
                        <FiTrash2 />
                      </button>
                    )}
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

export default ManageUsers;
