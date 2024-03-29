import express from "express";
import StudioController from "@/controllers/v1/StudioController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/Role";

const router = express.Router();

const path = "/studios";

router.get(path + "", CheckRole([Role.ADMIN]), StudioController.getAllStudios);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  StudioController.getStudioById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  StudioController.createStudio
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN]),
  StudioController.deleteStudio
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  StudioController.updateStudio
);

export { router as studioRoutes };
