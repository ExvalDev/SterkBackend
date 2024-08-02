import express from "express";
import UnitController from "@/controllers/v1/UnitController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";

const router = express.Router();

const path = "/units";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  UnitController.getAllUnits
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  UnitController.getUnitById
);
router.post(path + "", CheckRole([Role.ADMIN]), UnitController.createUnit);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN]),
  UnitController.deleteUnit
);
router.put(path + "/:id", CheckRole([Role.ADMIN]), UnitController.updateUnit);

export { router as unitRoutes };
