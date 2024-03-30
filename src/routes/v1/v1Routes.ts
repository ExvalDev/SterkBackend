import { Router } from "express";
import { unitRoutes } from "./routes/units";
import { trainingEntryRoutes } from "./routes/trainingEntries";
import { nfcTagsRoutes } from "./routes/nfcTags";
import { machineCategoryRoutes } from "./routes/machinecategories";
import { studioRoutes } from "./routes/studios";
import { sessionRoutes } from "./routes/sessions";
import { userRoutes } from "./routes/users";
import { machineRoutes } from "./routes/machines";

const router = Router();

router.use(unitRoutes);
router.use(trainingEntryRoutes);
router.use(nfcTagsRoutes);
router.use(machineCategoryRoutes);
router.use(machineRoutes);
router.use(studioRoutes);
router.use(sessionRoutes);
router.use(userRoutes);

export { router as v1Routes };
