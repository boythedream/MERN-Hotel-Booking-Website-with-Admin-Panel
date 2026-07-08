import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="eyebrow mb-2 text-center">Welcome back</div>
      <h1 className="font-display text-3xl font-medium text-center mb-8">Sign in</h1>

      <form onSubmit={handleSubmit} className="plaque p-6 space-y-4">
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Email</label>
          <input
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Password</label>
          <input
            type="password"
            className="input"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-ink-900/50 text-center pt-2">
          Demo: admin@hotel.com / admin123 or guest@hotel.com / guest123
        </p>
      </form>

      <p className="text-center text-sm text-ink-900/60 mt-6">
        New here?{" "}
        <Link to="/register" className="text-brass-dark font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default Login;
