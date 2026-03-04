import { Router } from "express";
import { joinBlock, leaveBlock } from "../controllers/joinBlock.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/join", auth, role(["STUDENT"]), joinBlock);
router.post("/leave", auth, role(["STUDENT"]), leaveBlock);

export default router;
