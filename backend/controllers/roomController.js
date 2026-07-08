import asyncHandler from "../utils/asyncHandler.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

// @desc    Get all rooms (with filters: category, minPrice, maxPrice, capacity, search)
// @route   GET /api/rooms
// @access  Public
export const getRooms = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, capacity, search, sort } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (capacity) filter.capacity = { $gte: Number(capacity) };
  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let query = Room.find(filter);

  if (sort === "price-asc") query = query.sort({ pricePerNight: 1 });
  else if (sort === "price-desc") query = query.sort({ pricePerNight: -1 });
  else query = query.sort({ createdAt: -1 });

  const rooms = await query;
  res.json({ success: true, count: rooms.length, rooms });
});

// @desc    Get single room by id
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  res.json({ success: true, room });
});

// @desc    Check room availability for a date range
// @route   GET /api/rooms/:id/availability?checkIn=...&checkOut=...
// @access  Public
export const checkRoomAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;
  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error("checkIn and checkOut dates are required");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    res.status(400);
    throw new Error("checkOut date must be after checkIn date");
  }

  const conflictingBooking = await Booking.findOne({
    room: req.params.id,
    status: { $in: ["pending", "confirmed"] },
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  res.json({ success: true, available: !conflictingBooking });
});

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = asyncHandler(async (req, res) => {
  const room = await Room.create(req.body);
  res.status(201).json({ success: true, room });
});

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  res.json({ success: true, room });
});

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }
  await room.deleteOne();
  res.json({ success: true, message: "Room removed" });
});
