import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import express, { NextFunction, Request, Response } from "express";
import path from "path";

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "static",
      "pages",
      "index.html"
    );
    return res.status(HttpStatusCode.OK).sendFile(filePath);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/resetPassword",
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const filePath = path.join(
        __dirname,
        "..",
        "static",
        "pages",
        "resetPassword.html"
      );
      return res.status(HttpStatusCode.OK).sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
);

export { router as pageRoutes };
