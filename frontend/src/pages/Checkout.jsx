import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const PaymentForm = ({ booking, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await api.post("/payments/confirm", {
          bookingId: booking._id,
          paymentIntentId: paymentIntent.id,
        });
        toast.success("Payment confirmed — see you soon!");
        onSuccess();
      } catch {
        toast.error("Payment succeeded but confirmation failed. Contact support.");
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="plaque p-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full mt-6 disabled:opacity-60"
      >
        {processing ? "Processing..." : `Pay $${booking.totalPrice}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const { data: bookingData } = await api.get(`/bookings/${bookingId}`);
        setBooking(bookingData.booking);

        if (bookingData.booking.paymentStatus === "paid") {
          setLoading(false);
          return;
        }

        const { data: intentData } = await api.post("/payments/create-payment-intent", {
          bookingId,
        });
        setClientSecret(intentData.clientSecret);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not start checkout");
        navigate("/my-bookings");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [bookingId, navigate]);

  if (loading) return <Loader label="Preparing your key card" />;
  if (!booking) return null;

  if (booking.paymentStatus === "paid") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="font-mono text-5xl text-moss mb-4">✓</div>
        <h1 className="font-display text-3xl font-medium mb-3">Already paid</h1>
        <p className="text-ink-900/60 mb-8">This booking has already been confirmed and paid.</p>
        <button onClick={() => navigate("/my-bookings")} className="btn-primary">
          View my bookings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="eyebrow mb-2 text-center">Room {booking.room?.roomNumber}</div>
      <h1 className="font-display text-3xl font-medium text-center mb-2">Complete payment</h1>
      <p className="text-center text-ink-900/60 text-sm mb-8">
        {booking.room?.name} · {booking.nights} night{booking.nights > 1 ? "s" : ""} · $
        {booking.totalPrice}
      </p>

      {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? (
        <div className="plaque p-6 text-sm text-ink-900/60">
          Stripe isn't configured yet. Add <code className="font-mono">VITE_STRIPE_PUBLISHABLE_KEY</code> to
          your frontend <code className="font-mono">.env</code> and <code className="font-mono">STRIPE_SECRET_KEY</code> to
          your backend <code className="font-mono">.env</code> to enable payments.
        </div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm booking={booking} onSuccess={() => navigate("/my-bookings")} />
        </Elements>
      ) : (
        <Loader label="Connecting to Stripe" />
      )}
    </div>
  );
};

export default Checkout;
