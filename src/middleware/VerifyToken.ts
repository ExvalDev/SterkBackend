import User from "@/models/User";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HTTP401Error } from "@/util/error";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HTTP401Error("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];

  // Verify the JWT token is well-formed and valid
  jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      throw new HTTP401Error("Unauthorized: Invalid token");
    }

    // Token is valid, now check if it matches the hashed token for this user in the database
    try {
      const user = await User.findByPk(decoded.id); // Assuming the JWT contains the user ID as 'id'
      if (!user) {
        throw new HTTP401Error("Unauthorized: User not found");
      }

      // Compare the provided token with the hashed token stored in the database
      const tokenIsValid = await bcrypt.compare(token, user.access_token);
      if (!tokenIsValid) {
        throw new HTTP401Error("Unauthorized: Token mismatch");
      }

      req.body.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        language: user.language,
        role: decoded.role,
      };
      next();
    } catch (error) {
      next(error);
    }
  });
};

export default verifyToken;
