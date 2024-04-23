import express, { Express } from "express";

import swaggerUi from "swagger-ui-express";
import { config } from "@/config/swagger";

import { pageRoutes } from "./pages";

import verifyToken from "@/middleware/VerifyToken";

import { authRoutes } from "./auth";

import ErrorHandler from "@/middleware/ErrorHandler";
import { v1Routes } from "./v1/v1Routes";

import setLanguage from "@/middleware/SetLanguage";
import middleware from "i18next-http-middleware";
import i18next from "@/config/i18n";

export const createRoutes = (app: Express) => {
  // STATIC
  app.use(express.static("public"));

  // PAGES
  app.use(pageRoutes);

  // SWAGGER
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config));

  app.use(middleware.handle(i18next));
  // AUTH
  app.use("/api/auth", authRoutes);

  // VERIFY TOKEN
  app.use(verifyToken);

  // SET LANGUAGE
  app.use(setLanguage);

  app.use("/api/v1", v1Routes);

  // ERROR HANDLER - Middleware
  app.use(ErrorHandler);
};
