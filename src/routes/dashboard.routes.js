import { Router } from "express";
import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.get("/", auth, role(["ADMIN"]), getDashboardAnalytics);

export default router;
