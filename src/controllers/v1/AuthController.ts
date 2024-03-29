import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "@/models/User"; // Adjust the path as necessary
import {
  HTTP400Error,
  HTTP401Error,
  HTTP403Error,
  HTTP404Error,
  HTTP409Error,
} from "@/util/error"; // Adjust the path as necessary
import { generateAccessToken, generateRefreshToken } from "@/util/helpers";
import { HttpStatusCode } from "@/types/HttpStatusCode";
import Token from "@/models/Token";
import Role from "@/models/Role";
import logger from "@/config/winston";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

class AuthController {
  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: User registered successfully.
   *       400:
   *         description: Bad request.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, language, roleId } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        throw new HTTP409Error("Email already in use");
      }

      if (!password) {
        throw new HTTP400Error("Password is required");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      return await User.create({
        name,
        email,
        password: hashedPassword,
        language,
        roleId,
      })
        .then((user) => {
          logger.info(`User registered: ${user.email}`);
          const { password: _, ...userWithoutPassword } = user.toJSON();
          return res.status(201).json(userWithoutPassword);
        })
        .catch((error) => {
          throw new HTTP400Error("BAD REQUEST", error);
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: User logged in successfully.
   *       400:
   *         description: Bad request.
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new HTTP400Error("Email and password are required");
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new HTTP404Error("Authentication failed. User not found.");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HTTP401Error("Authentication failed. Wrong password.");
      }

      const sessionId = uuidv4();
      const access_token = await generateAccessToken(user, sessionId);
      const refresh_token = await generateRefreshToken(user, sessionId);

      Token.create({
        sessionId: sessionId,
        access_token: await bcrypt.hash(access_token, 12),
        refresh_token: await bcrypt.hash(refresh_token, 12),
        userId: user.id,
      });

      return res.status(HttpStatusCode.OK).json({
        message: "User logged in successfully",
        access_token,
        refresh_token,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/auth/refresh/{refreshToken}:
   *   get:
   *     summary: Refresh the access token
   *     tags: [Auth]
   *     description: This endpoint is used to refresh the access token using a valid refresh token. The refresh token should be sent in the request param.
   *     responses:
   *       200:
   *         description: Successfully refreshed the access token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 accessToken:
   *                   type: string
   *                   description: The new access token.
   *                 refreshToken:
   *                   type: string
   *                   description: The new refresh token (if rotating refresh tokens is enabled).
   *       400:
   *         description: Bad request. Possible reasons include missing refresh token in the request body.
   *       401:
   *         description: Unauthorized. The refresh token is invalid or expired.
   *       500:
   *         description: Server error. Something went wrong on the server.
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.params;
      if (!refreshToken) {
        throw new HTTP400Error("Refresh token required");
      }

      // Verify refresh token
      jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return next(new HTTP403Error("Invalid refresh token"));
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
          return next(new HTTP404Error("User not found"));
        }

        const sessionId = decoded.session;
        const token = await Token.findOne({
          where: {
            sessionId: sessionId,
            userId: decoded.id,
          },
        });
        if (!token) {
          return next(new HTTP404Error("No Token found for this user."));
        }

        const newAccessToken = await generateAccessToken(user, sessionId);
        const newRefreshToken = await generateRefreshToken(user, sessionId);
        token.access_token = await bcrypt.hash(newAccessToken, 12);
        token.refresh_token = await bcrypt.hash(newRefreshToken, 12);
        await token.save();

        res.json({
          userId: user.id,
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        });
      });
    } catch (error) {
      next(error);
    }
  }
  /**
   * @swagger
   * /api/v1/auth/logout:
   *   get:
   *     summary: Log out a user
   *     tags: [Auth]
   *     description: This endpoint is used to log out a user by invalidating the current access token. The access token should be provided in the Authorization header.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Successfully logged out. The session associated with the access token has been invalidated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Successfully logged out
   *       401:
   *         description: Unauthorized. Possible reasons include no access token provided, or the provided access token is invalid or expired.
   *       404:
   *         description: Session not found. Indicates that the session associated with the provided token could not be found.
   *       500:
   *         description: Server error. Something went wrong on the server.
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new HTTP401Error("Unauthorized: No access token provided");
      }
      const accessToken = authHeader.split(" ")[1];

      // Verify the access token to extract the sessionId or userId
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          throw new HTTP401Error("Unauthorized: Invalid token!");
        }

        try {
          const token = await Token.findOne({
            where: {
              userId: decoded.id,
              sessionId: decoded.session,
            },
          });
          if (!token) {
            throw new HTTP404Error("Session not found");
          }

          await token.destroy();
        } catch (error) {
          next(error);
        }
      });
      return res
        .status(HttpStatusCode.OK)
        .json({ message: "Successfully logged out" });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
