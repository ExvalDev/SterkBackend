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

  const response = {
    name: error.name,
    httpCode: error.httpCode || 500,
  };

  if (Array.isArray(error.description)) {
    response["errors"] = error.description;
  } else {
    response["description"] =
      error.description || "An unexpected error occurred";
  }

  return res.status(error.httpCode || 500).json(response);
};

export default ErrorHandler;
