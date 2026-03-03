import { Router } from "express";
import {
	deleteStudent,
	getStudentById,
	getStudents,
	getStudentsByBlock,
	updateStudent,
} from "../controllers/student.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.get("/", auth, role(["ADMIN"]), getStudents);
router.get("/:id", auth, getStudentById);
router.put("/:id", auth, role(["ADMIN"]), updateStudent);
router.delete("/:id", auth, role(["ADMIN"]), deleteStudent);
router.get("/block/:blockId", auth, role(["ADMIN"]), getStudentsByBlock);

export default router;
