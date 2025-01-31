import express from "express";
import NFCTagController from "@/controllers/v1/NFCTagController";
import CheckRole from "@/middleware/CheckRole";
import { Role } from "@/types/enums/Role";

const router = express.Router();

const path = "/nfctags";

router.get(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  NFCTagController.getNFCTags
);
router.get(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER, Role.USER]),
  NFCTagController.getNFCTagById
);
router.post(
  path + "",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  NFCTagController.createNFCTag
);
router.delete(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  NFCTagController.deleteNFCTag
);
router.put(
  path + "/:id",
  CheckRole([Role.ADMIN, Role.STUDIO_OWNER]),
  NFCTagController.updateNFCTag
);

export { router as nfcTagsRoutes };
