import TrainingDataController from "@/controllers/v1/TrainingEntryController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";
import express from "express";

const router = express.Router();

const path = "/trainingEntries";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  TrainingDataController.getAllTrainingEntries
);
router.get(
  path + "/user",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.getTrainingEntriesByUser
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.getTrainingEntryById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.createTrainingEntry
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.deleteTrainingEntry
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.updateTrainingEntry
);

export { router as trainingEntryRoutes };
