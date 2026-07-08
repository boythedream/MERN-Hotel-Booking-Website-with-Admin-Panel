import express from "express";
import {
  getRooms,
  getRoomById,
  checkRoomAvailability,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getRooms).post(protect, admin, createRoom);
router.get("/:id/availability", checkRoomAvailability);
router
  .route("/:id")
  .get(getRoomById)
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

export default router;
