import { Router } from "express";
import {
	bulkCreateStudents,
	createStudentByAdmin,
	deleteStudentByAdmin,
	getAllStudents,
	updateStudentByAdmin,
} from "../controllers/admin-student.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

// All routes require admin authentication
router.use(auth, role(["ADMIN"]));

router.post("/create", createStudentByAdmin);
router.get("/", getAllStudents);
router.put("/:id", updateStudentByAdmin);
router.delete("/:id", deleteStudentByAdmin);
router.post("/bulk", bulkCreateStudents);

export default router;
