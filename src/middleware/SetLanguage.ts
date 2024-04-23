import logger from "@/config/winston";
import { NextFunction, Request, Response } from "express";

const setLanguage = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user;
    if (user && user.language) {
      req.i18n.changeLanguage(user.language);
    }
    next();
  } catch (error) {
    logger.error(error.message);
  }
};

export default setLanguage;
