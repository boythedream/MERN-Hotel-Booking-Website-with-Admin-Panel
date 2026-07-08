import Stripe from "stripe";
import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/Booking.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// @desc    Create a Stripe payment intent for a booking
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this booking");
  }
  if (booking.paymentStatus === "paid") {
    res.status(400);
    throw new Error("This booking has already been paid");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100), // cents
    currency: "usd",
    metadata: { bookingId: booking._id.toString() },
  });

  booking.paymentIntentId = paymentIntent.id;
  await booking.save();

  res.json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc    Confirm payment succeeded and update booking
// @route   POST /api/payments/confirm
// @access  Private
export const confirmPayment = asyncHandler(async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded") {
    res.status(400);
    throw new Error("Payment has not been completed");
  }

  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  await booking.save();

  res.json({ success: true, booking });
});
