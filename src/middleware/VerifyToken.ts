import User from "@/models/User";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { HTTP401Error } from "@/utils/error";
import AuthToken from "@/models/AuthToken";
import { Role } from "@/types/enums/Role";
import Studio from "@/models/Studio";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HTTP401Error("Unauthorized: No token provided");
    }

    const access_token = authHeader.split(" ")[1];

    // Verify the JWT token is well-formed and valid
    await jwt.verify(
      access_token,
      ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          throw new HTTP401Error("Unauthorized: Invalid token!");
        }

        try {
          // Find all tokens for the user decoded from the JWT
          const token = await AuthToken.findOne({
            where: {
              userId: decoded.id,
              sessionId: decoded.session,
            },
          });
          if (!token) {
            throw new HTTP401Error(
              "Unauthorized: No token found for user with the session: " +
                decoded.session
            );
          }

          // Check if any of the user's tokens match the provided token
          const tokenIsValid = await bcrypt.compare(
            access_token,
            token.access_token
          );
          if (!tokenIsValid) {
            throw new HTTP401Error("Unauthorized: Token mismatch");
          }

          // Assuming token is valid, fetch the user's details
          const user =
            decoded.role === Role.STUDIO_OWNER
              ? await User.findByPk(decoded.id, {
                  include: [{ model: Studio }],
                })
              : await User.findByPk(decoded.id);
          if (!user) {
            throw new HTTP401Error("Unauthorized: User not found");
          }

          req.body.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            language: user.language,
            role: decoded.role,
            studioId: user.Studios[0].id,
          };
        } catch (error) {
          next(error);
        }
        next();
      }
    );
  } catch (error) {
    next(error);
  }
};

export default verifyToken;
