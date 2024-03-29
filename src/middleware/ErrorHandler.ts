import { NextFunction, Request, Response } from "express";

import Error from "../types/Error";
import logger from "@/config/winston";

const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(error);
  return res.status(error.httpCode || 500).json({
    name: error.name,
    httpCode: error.httpCode || 500,
    description: error.description,
  });
};

export default ErrorHandler;
