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
      ? `${req.t(error.message, { lng: "en" })} [${error.validationErrors.join(
          ", "
        )}]`
      : req.t(error.message, { lng: "en" })
  );

  const response = {
    name: error.name,
    httpCode: error.httpCode || 500,
    message: req.t(error.message),
  };

  if (error.validationErrors) {
    response["errors"] = error.validationErrors;
  }

  return res.status(error.httpCode || 500).json(response);
};

export default ErrorHandler;
