import { HttpStatusCode } from "../types/HttpStatusCode";

class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: HttpStatusCode;
  public readonly description: string;

  constructor(name: string, httpCode: HttpStatusCode, description: string) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = name;
    this.httpCode = httpCode;
    this.description = description;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}

export class APIError extends BaseError {
  constructor(
    name: string,
    httpCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER,
    description = "internal server error"
  ) {
    super(name, httpCode, description);
  }
}

export class HTTP400Error extends BaseError {
  constructor(
    generalMessage: string = "Bad Request",
    validationErrors?: { type: string; path: string; message?: string }[]
  ) {
    let description = generalMessage; // Default message for bad requests

    // If validation errors are provided, format them
    if (validationErrors && validationErrors.length > 0) {
      description = validationErrors
        .map((error) => {
          switch (error.type) {
            case "notNull":
              return `Required field ${error.path} is missing.`;
            case "string.base":
              return `Field ${error.path} must be a string.`;
            case "number.base":
              return `Field ${error.path} must be a number.`;
            // Add more cases as needed for different types of validation errors
            default:
              // If there's a custom message provided, use it; otherwise, use a generic message
              return (
                error.message || `Validation error on field ${error.path}.`
              );
          }
        })
        .join(" "); // Join with a space or consider "; " for separation
    }

    super("BAD REQUEST", HttpStatusCode.BAD_REQUEST, description.trim());
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
