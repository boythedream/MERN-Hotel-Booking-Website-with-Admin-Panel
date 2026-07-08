import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `px-4 py-2.5 text-sm rounded-sm transition-colors ${
    isActive ? "bg-ink-900 text-paper-soft" : "text-ink-900/70 hover:bg-ink-900/5"
  }`;

const AdminNav = () => (
  <div className="flex flex-wrap gap-2 mb-10">
    <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
    <NavLink to="/admin/rooms" className={linkClass}>Rooms</NavLink>
    <NavLink to="/admin/bookings" className={linkClass}>Bookings</NavLink>
    <NavLink to="/admin/users" className={linkClass}>Users</NavLink>
  </div>
);

export default AdminNav;
