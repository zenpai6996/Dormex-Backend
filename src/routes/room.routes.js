import { Router } from "express";
import {
	assignStudentToRoom,
	createRoom,
	deleteRoom,
	getRooms,
	getRoomsByBlock,
	removeStudentFromRoom,
} from "../controllers/room.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/", auth, createRoom);
router.get("/", auth, getRooms);
router.get("/block/:blockId", auth, role(["ADMIN"]), getRoomsByBlock);

router.post("/assign", auth, role(["ADMIN"]), assignStudentToRoom);
router.post("/remove", auth, role(["ADMIN"]), removeStudentFromRoom);
router.post("/delete", auth, role(["ADMIN"]), deleteRoom);

export default router;
