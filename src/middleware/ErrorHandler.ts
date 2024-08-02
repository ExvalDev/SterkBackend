import { NextFunction, Request, Response } from "express";

import Error from "../types/interfaces/Error";
import logger from "@/config/winston";
import { ValidationErrorItem } from "sequelize";

const ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hasUnhandledValidationErrors =
    error["errors"] && error["errors"].length > 0;
  let validationErrors = "";
  if (hasUnhandledValidationErrors) {
    validationErrors = error["errors"]
      .map((validationError: ValidationErrorItem) => validationError.message)
      .join(", ");
  }

  logger.error(
    hasUnhandledValidationErrors
      ? validationErrors
      : req.t(error.message, { lng: "en" })
  );

  const response = {
    name: error.name,
    httpCode: error.httpCode || 500,
    message: req.t(error.message),
  };

  if (hasUnhandledValidationErrors) {
    response["errors"] = validationErrors;
  }

  return res.status(error.httpCode || 500).json(response);
};

export default ErrorHandler;
