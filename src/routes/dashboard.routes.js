import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", auth, getDashboardAnalytics);

export default router;
