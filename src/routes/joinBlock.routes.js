import { Router } from "express";
import {
	joinBlock,
	leaveBlock,
	removeStudentFromBlock,
} from "../controllers/joinBlock.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/join", auth, role(["STUDENT"]), joinBlock);
router.post("/leave", auth, role(["STUDENT"]), leaveBlock);
router.post("/remove-student", auth, role(["ADMIN"]), removeStudentFromBlock);

export default router;
