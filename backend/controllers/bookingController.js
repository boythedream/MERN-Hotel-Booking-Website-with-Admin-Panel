import asyncHandler from "../utils/asyncHandler.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

const msPerNight = 1000 * 60 * 60 * 24;

// Helper: throws if the room is already booked for the given range
const assertRoomIsFree = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const filter = {
    room: roomId,
    status: { $in: ["pending", "confirmed"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) filter._id = { $ne: excludeBookingId };

  const conflict = await Booking.findOne(filter);
  if (conflict) {
    const err = new Error("Room is not available for the selected dates");
    err.statusCode = 409;
    throw err;
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, guests, guestDetails } = req.body;

  if (!roomId || !checkIn || !checkOut || !guestDetails) {
    res.status(400);
    throw new Error("Missing required booking fields");
  }

  const room = await Room.findById(roomId);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    res.status(400);
    throw new Error("checkOut date must be after checkIn date");
  }
  if (checkInDate < new Date(new Date().toDateString())) {
    res.status(400);
    throw new Error("checkIn date cannot be in the past");
  }
  if (guests > room.capacity) {
    res.status(400);
    throw new Error(`This room only accommodates up to ${room.capacity} guests`);
  }

  try {
    await assertRoomIsFree(roomId, checkInDate, checkOutDate);
  } catch (err) {
    res.status(err.statusCode || 409);
    throw err;
  }

  const nights = Math.round((checkOutDate - checkInDate) / msPerNight);
  const totalPrice = nights * room.pricePerNight;

  const booking = await Booking.create({
    user: req.user._id,
    room: roomId,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    guests,
    nights,
    totalPrice,
    guestDetails,
  });

  const populated = await booking.populate("room", "name roomNumber category images pricePerNight");
  res.status(201).json({ success: true, booking: populated });
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room", "name roomNumber category images pricePerNight")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("room").populate("user", "name email");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  const isOwner = booking.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }
  res.json({ success: true, booking });
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  const isOwner = booking.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }
  if (booking.status === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  booking.status = "cancelled";
  await booking.save();
  res.json({ success: true, booking });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const bookings = await Booking.find(filter)
    .populate("room", "name roomNumber category")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  res.json({ success: true, booking });
});
