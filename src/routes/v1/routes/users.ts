import express from "express";
import UserController from "@/controllers/v1/UserController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";

const router = express.Router();

const path = "/users";

router.get(path + "", CheckRole([Role.ADMIN]), UserController.getAllUsers);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  UserController.getUserById
);
router.post(path + "", CheckRole([Role.ADMIN]), UserController.createUser);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN]),
  UserController.deleteUser
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  UserController.updateUser
);

export { router as userRoutes };
