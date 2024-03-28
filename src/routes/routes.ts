import { Express } from "express";
import { unitRoutes } from "./v1/units";
import { trainingDataRoutes } from "./v1/trainingData";
import { nfcTagsRoutes } from "./v1/nfcTags";
import { machineCategoryRoutes } from "./v1/machinecategories";
import { studioRoutes } from "./v1/studios";
import { sessionRoutes } from "./v1/sessions";
import { userRoutes } from "./v1/users";
import { authRoutes } from "./v1/auth";
import verifyToken from "@/middleware/VerifyToken";

export const createRoutes = (app: Express) => {
  // API
  app.use("/api", authRoutes);

  // VERIFY TOKEN
  app.use(verifyToken);

  //V1
  app.use("/api/v1", userRoutes);
  app.use("/api/v1", unitRoutes);
  app.use("/api/v1", nfcTagsRoutes);
  app.use("/api/v1", trainingDataRoutes);
  app.use("/api/v1", machineCategoryRoutes);
  app.use("/api/v1", studioRoutes);
  app.use("/api/v1", sessionRoutes);
};
