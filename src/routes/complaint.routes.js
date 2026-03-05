import { Router } from "express";
import {
	createComplaint,
	deleteComplaint,
	getComplaints,
	updateComplaintStatus,
} from "../controllers/complaint.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/", auth, role(["STUDENT"]), createComplaint);
router.get("/", auth, getComplaints);
router.put("/:id", auth, role(["ADMIN"]), updateComplaintStatus);
router.delete("/:id", auth, deleteComplaint);

export default router;
