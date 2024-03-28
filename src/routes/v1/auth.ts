import AuthController from "@/controllers/v1/AuthController";
import express from "express";
import passport from "passport";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  AuthController.login
);
router.post("/register", AuthController.register);
router.get("/refresh/:refreshToken", AuthController.refresh);

export { router as authRoutes };
