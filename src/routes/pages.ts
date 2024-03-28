import express from "express";
import path from "path";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "..", "pages", "index.html"));
  } catch (error) {
    next(error);
  }
});

export { router as pageRoutes };
