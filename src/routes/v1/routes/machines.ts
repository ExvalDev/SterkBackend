import express from "express";
import MachineController from "@/controllers/v1/MachineController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/Role";

const router = express.Router();

const path = "/machines";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  MachineController.getAllMachines
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  MachineController.getMachineById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  MachineController.createMachine
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  MachineController.deleteMachine
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  MachineController.updateMachine
);

export { router as machineRoutes };
