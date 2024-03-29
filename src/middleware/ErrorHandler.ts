import e, { NextFunction, Request, Response } from "express";

import Error from "../types/Error";
import logger from "@/config/winston";

const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(
    error.validationErrors
      ? `${error.message} [${error.validationErrors.join(", ")}]`
      : error.message
  );

  const response = {
    name: error.name,
    httpCode: error.httpCode || 500,
    message: error.message,
  };

  if (error.validationErrors) {
    response["errors"] = error.validationErrors;
  }

  return res.status(error.httpCode || 500).json(response);
};

export default ErrorHandler;
