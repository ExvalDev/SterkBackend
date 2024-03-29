import AuthController from "@/controllers/v1/AuthController";
import express from "express";

const router = express.Router();

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get("/refresh/:refreshToken", AuthController.refresh);
router.get("/logout", AuthController.logout);

export { router as authRoutes };
