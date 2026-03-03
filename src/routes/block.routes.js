import { Router } from "express";
import {
	createBlock,
	deleteBlock,
	getBlockById,
	getBlocks,
	regenerateInviteCode,
	updateBlock,
} from "../controllers/block.controller.js";
import auth from "../middleware/auth.middleware.js";
import role from "../middleware/role.middleware.js";

const router = Router();

router.post("/", auth, role(["ADMIN"]), createBlock);
router.get("/", auth, role(["ADMIN"]), getBlocks);
router.get("/:id", auth, role(["ADMIN"]), getBlockById);

router.put("/:id", auth, role(["ADMIN"]), updateBlock);
router.delete("/:id", auth, role(["ADMIN"]), deleteBlock);
router.patch(
	"/:id/regenerate-code",
	auth,
	role(["ADMIN"]),
	regenerateInviteCode,
);

export default router;
