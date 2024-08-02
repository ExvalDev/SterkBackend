import express from "express";
import MachineCategoryController from "@/controllers/v1/MachineCategoryController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";

const router = express.Router();

const path = "/machinecategories";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  MachineCategoryController.getAllMachineCategories
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  MachineCategoryController.getMachineCategoryById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN]),
  MachineCategoryController.createMachineCategory
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN]),
  MachineCategoryController.deleteMachineCategory
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN]),
  MachineCategoryController.updateMachineCategory
);

export { router as machineCategoryRoutes };
