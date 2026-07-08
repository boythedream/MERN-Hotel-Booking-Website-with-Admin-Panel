import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div className="eyebrow mb-2 text-center">Join us</div>
      <h1 className="font-display text-3xl font-medium text-center mb-8">Create an account</h1>

      <form onSubmit={handleSubmit} className="plaque p-6 space-y-4">
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Full name</label>
          <input
            type="text"
            className="input"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
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
          <label className="text-xs text-ink-900/60 mb-1 block">Phone</label>
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-900/60 mb-1 block">Password</label>
          <input
            type="password"
            className="input"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-900/60 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brass-dark font-medium">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
