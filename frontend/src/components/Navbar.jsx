import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `text-sm tracking-wide transition-colors ${
    isActive ? "text-brass-dark" : "text-ink-900/80 hover:text-ink-900"
  }`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink-900/10">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-ink-900">
            Meridian
          </span>
          <span className="eyebrow">House</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass}>
            Rooms
          </NavLink>
          {user && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              My Bookings
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="flex items-center gap-2 text-sm text-ink-900/80 hover:text-ink-900">
                <FiUser /> {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 text-sm">
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink-900/80 hover:text-ink-900">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">
                Book now
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-900/10 bg-paper-soft px-6 py-4 flex flex-col gap-4">
          <NavLink to="/" className={navLinkClass} end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={navLinkClass} onClick={() => setOpen(false)}>
            Rooms
          </NavLink>
          {user && (
            <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setOpen(false)}>
              My Bookings
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          <div className="hairline pt-4 flex flex-col gap-3">
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-sm">
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>
                  Book now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
