import User from "@/models/User";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HTTP401Error } from "@/util/error";
import Token from "@/models/Token";

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
      return next(new HTTP401Error("Unauthorized: Invalid token!"));
    }

    try {
      // Find all tokens for the user decoded from the JWT
      const tokens = await Token.findAll({
        where: { userId: decoded.id }, // Assuming 'decoded.id' is the user ID
      });

      if (!tokens || tokens.length === 0) {
        return next(new HTTP401Error("Unauthorized: No tokens found for user"));
      }

      // Check if any of the user's tokens match the provided token
      const tokenIsValid = await tokens.some(async (token) => {
        return await bcrypt.compare(token, token.access_token);
      });

      if (!tokenIsValid) {
        return next(new HTTP401Error("Unauthorized: Token mismatch"));
      }

      // Assuming token is valid, fetch the user's details
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return next(new HTTP401Error("Unauthorized: User not found"));
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
