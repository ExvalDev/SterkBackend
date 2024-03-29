import express, { Express } from "express";

import swaggerUi from "swagger-ui-express";
import { config } from "@/config/swagger";

import { pageRoutes } from "./pages";

import verifyToken from "@/middleware/VerifyToken";

import { authRoutes } from "./auth";

import ErrorHandler from "@/middleware/ErrorHandler";
import { v1Routes } from "./v1/v1Routes";

export const createRoutes = (app: Express) => {
  // STATIC
  app.use(express.static("public"));

  // PAGES
  app.use(pageRoutes);

  // SWAGGER
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config));

  // AUTH
  app.use("/api", authRoutes);

  app.use("/api/v1", verifyToken, v1Routes);

  // ERROR HANDLER - Middleware
  app.use(ErrorHandler);
};
