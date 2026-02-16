import { Router } from "express";
import {
	createMenu,
	getMenu,
	updateMenu,
} from "../controllers/mess.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/", auth, role(["ADMIN"]), createMenu);
router.get("/", auth, getMenu);
router.put("/:id", auth, role(["ADMIN"]), updateMenu);

export default router;
