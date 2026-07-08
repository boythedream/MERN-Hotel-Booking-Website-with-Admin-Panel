import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roomNumber: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Standard", "Deluxe", "Suite", "Executive", "Presidential"],
      default: "Standard",
    },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1, default: 2 },
    beds: { type: String, default: "1 Queen Bed" },
    size: { type: Number, default: 30 }, // sq meters
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    ratingAverage: { type: Number, default: 4.5, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    floor: { type: Number, default: 1 },
  },
  { timestamps: true }
);

roomSchema.index({ category: 1 });
roomSchema.index({ pricePerNight: 1 });

const Room = mongoose.model("Room", roomSchema);
export default Room;
