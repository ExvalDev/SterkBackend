import AuthController from "@/controllers/v1/AuthController";
import express from "express";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export { router as authRoutes };
