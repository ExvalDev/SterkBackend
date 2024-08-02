import express from "express";
import StudioController from "@/controllers/v1/StudioController";
import SessionController from "@/controllers/v1/SessionController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";

const router = express.Router();

const path = "/sessions";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  SessionController.getAllSessions
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  SessionController.getSessionById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  SessionController.createSession
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  SessionController.deleteSession
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  SessionController.updateSession
);

export { router as sessionRoutes };
