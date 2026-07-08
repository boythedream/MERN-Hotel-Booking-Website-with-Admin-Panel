import express from "express";
import {
  updateProfile,
  getUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/profile", protect, updateProfile);
router.get("/", protect, admin, getUsers);
router.put("/:id/role", protect, admin, updateUserRole);
router.delete("/:id", protect, admin, deleteUser);

export default router;
