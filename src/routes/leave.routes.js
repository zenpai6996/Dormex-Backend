import { Router } from "express";
import {
	createLeave,
	getLeaves,
	updateLeaveStatus,
} from "../controllers/leave.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/", auth, role(["STUDENT"]), createLeave);
router.get("/", auth, getLeaves);
router.patch("/:id/status", auth, role(["ADMIN"]), updateLeaveStatus);

export default router;
