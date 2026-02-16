import { Router } from "express";
import { createRoom, getRooms } from "../controllers/room.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", auth, createRoom);
router.get("/", auth, getRooms);

export default router;
