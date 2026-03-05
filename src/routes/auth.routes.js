import { Router } from "express";
import {
	changePassword,
	getProfile,
	login,
	register,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.post("/change-password", auth, changePassword);

export default router;
