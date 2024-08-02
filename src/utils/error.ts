import { ForeignKeyConstraintError, ValidationError } from "sequelize";
import { HttpStatusCode } from "../types/enums/HttpStatusCode";

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly validationErrors: string[];

  constructor(
    name: string,
    httpCode: HttpStatusCode,
    message: string,
    validationErrors?: string[]
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.validationErrors = validationErrors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}

export class HTTP400Error extends BaseError {
  constructor(message: string = "Bad Request", error?: Error) {
    let errors = [];
    if (error instanceof ValidationError) {
      const validationErrors = error.errors;
      if (validationErrors && validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          switch (error.validatorKey) {
            case "is_null":
              errors.push(`Required field ${error.path} is missing`);
              break;
            default:
              errors.push(
                error.message || `Validation error on field ${error.path}`
              );
          }
        });
      }
    }
    if (error instanceof ForeignKeyConstraintError) {
      const foreignKeyError = error as ForeignKeyConstraintError;
      message = `This ${foreignKeyError.fields[0]} does not exist!`;
    }

    if (errors.length > 0) {
      super(
        "BAD REQUEST",
        HttpStatusCode.BAD_REQUEST,
        "Validation Errors",
        errors
      );
    } else {
      super("BAD REQUEST", HttpStatusCode.BAD_REQUEST, message);
    }
  }
}

export class HTTP401Error extends BaseError {
  constructor(description = "Unauthorized") {
    super("UNAUTHORIZED", HttpStatusCode.UNAUTHORIZED, description);
  }
}

export class HTTP403Error extends BaseError {
  constructor(description = "A token is required for authentication") {
    super("FORBIDDEN", HttpStatusCode.FORBIDDEN, description);
  }
}

export class HTTP404Error extends BaseError {
  constructor(description = "bad request") {
    super("NOT FOUND", HttpStatusCode.NOT_FOUND, description);
  }
}

export class HTTP409Error extends BaseError {
  constructor(description = "User Already Exist. Please Login!") {
    super("CONFLICT", HttpStatusCode.CONFLICT, description);
  }
}
