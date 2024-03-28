import User from "@/models/User";

export {};

// Module augmentation for Express
declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
