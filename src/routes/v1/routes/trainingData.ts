import TrainingDataController from "@/controllers/v1/TrainingDataController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/Role";
import express from "express";

const router = express.Router();

const path = "/trainingData";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.getAllTrainingData
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.getTrainingDataById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.createTrainingData
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.deleteTrainingData
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  TrainingDataController.updateTrainingData
);

export { router as trainingDataRoutes };
