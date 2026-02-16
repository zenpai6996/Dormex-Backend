import { Router } from "express";
import {
	deleteStudent,
	getStudentById,
	getStudents,
	updateStudent,
} from "../controllers/student.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.get("/", auth, role(["ADMIN"]), getStudents);
router.get("/:id", auth, getStudentById);
router.put("/:id", auth, role(["ADMIN"]), updateStudent);
router.delete("/:id", auth, role(["ADMIN"]), deleteStudent);

export default router;
