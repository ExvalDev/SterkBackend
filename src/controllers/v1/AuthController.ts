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
} from "@/utils/error"; // Adjust the path as necessary
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
} from "@/utils/helpers";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import AuthToken from "@/models/AuthToken";
import logger from "@/config/winston";
import TokenResponse from "@/types/classes/TokenResponse";
import MailService from "@/services/mailService";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET;

class AuthController {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     security: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       200:
   *         description: User logged in successfully.
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                  access_token:
   *                    type: string
   *                  access_token_expires:
   *                    type: string
   *                  refresh_token:
   *                    type: string
   *                  refresh_token_expires:
   *                    type: string
   *       400:
   *         description: Bad request.
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, language, roleId } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        throw new HTTP409Error("emailAlreadyInUse");
      }

      if (!password) {
        throw new HTTP400Error("passwordIsRequired");
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      return await User.create({
        name,
        email,
        password: hashedPassword,
        language,
        roleId,
      })
        .then(async (user) => {
          logger.info(`User registered: ${user.email}`);
          MailService.sendRegistrationMail(user);
          const sessionId = uuidv4();
          const access_token = await generateAccessToken(user, sessionId);
          const refresh_token = await generateRefreshToken(user, sessionId);

          AuthToken.create({
            sessionId: sessionId,
            access_token: await bcrypt.hash(access_token, 12),
            refresh_token: await bcrypt.hash(refresh_token, 12),
            userId: user.id,
          });

          return res
            .status(HttpStatusCode.OK)
            .json(
              new TokenResponse(
                req.t("userLoggedInSuccessfully", { lng: user.language }),
                access_token,
                refresh_token
              )
            );
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
   * /api/auth/login:
   *   post:
   *     summary: Log in a user
   *     tags: [Auth]
   *     security: []
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
   *         content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  message:
   *                    type: string
   *                  access_token:
   *                    type: string
   *                  access_token_expires:
   *                    type: string
   *                  refresh_token:
   *                    type: string
   *                  refresh_token_expires:
   *                    type: string
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
        throw new HTTP404Error("authenticationFailedUserNotFound");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HTTP401Error("authenticationFailedWrongPassword");
      }

      const sessionId = uuidv4();
      const access_token = await generateAccessToken(user, sessionId);
      const refresh_token = await generateRefreshToken(user, sessionId);

      AuthToken.create({
        sessionId: sessionId,
        access_token: await bcrypt.hash(access_token, 12),
        refresh_token: await bcrypt.hash(refresh_token, 12),
        userId: user.id,
      });

      return res
        .status(HttpStatusCode.OK)
        .json(
          new TokenResponse(
            req.t("userLoggedInSuccessfully", { lng: user.language }),
            access_token,
            refresh_token
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Refresh the access token
   *     tags: [Auth]
   *     security: []
   *     description: This endpoint is used to refresh the access token using a valid refresh token. The refresh token should be sent in the request body.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *        schema:
   *          type: object
   *          required:
   *            - refresh_token
   *     responses:
   *       200:
   *         description: Successfully refreshed the access token.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  message:
   *                    type: string
   *                  access_token:
   *                    type: string
   *                  access_token_expires:
   *                    type: string
   *                  refresh_token:
   *                    type: string
   *                  refresh_token_expires:
   *                    type: string
   *                    description: The new refresh token (if rotating refresh tokens is enabled).
   *       400:
   *         description: Bad request. Possible reasons include missing refresh token in the request body.
   *       401:
   *         description: Unauthorized. The refresh token is invalid or expired.
   *       500:
   *         description: Server error. Something went wrong on the server.
   */
  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        throw new HTTP400Error("refreshTokenRequired");
      }

      // Verify refresh token
      jwt.verify(refresh_token, REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          return next(new HTTP403Error("invalidRefreshToken"));
        }

        const user = await User.findByPk(decoded.id);
        if (!user) {
          return next(new HTTP404Error("userNotFound"));
        }

        const sessionId = decoded.session;
        const token = await AuthToken.findOne({
          where: {
            sessionId: sessionId,
            userId: decoded.id,
          },
        });
        if (!token) {
          return next(new HTTP404Error("noTokenFoundForThisUserAndSession"));
        }

        const newAccessToken = await generateAccessToken(user, sessionId);
        const newRefreshToken = await generateRefreshToken(user, sessionId);
        token.access_token = await bcrypt.hash(newAccessToken, 12);
        token.refresh_token = await bcrypt.hash(newRefreshToken, 12);
        await token.save();

        res.json(
          new TokenResponse(
            `${req.t("tokenRefreshedForUser", { lng: user.language })}: ${
              user.id
            }`,
            newAccessToken,
            newRefreshToken
          )
        );
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/logout:
   *   get:
   *     summary: Log out a user
   *     tags: [Auth]
   *     security: []
   *     description: This endpoint is used to log out a user by invalidating the current access token. The access token should be provided in the Authorization header.
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
        throw new HTTP401Error("noAccessTokenProvid");
      }
      const accessToken = authHeader.split(" ")[1];

      // Verify the access token to extract the sessionId or userId
      jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
          throw new HTTP401Error("invalidToken");
        }

        try {
          const token = await AuthToken.findOne({
            where: {
              userId: decoded.id,
              sessionId: decoded.session,
            },
          });
          if (!token) {
            throw new HTTP404Error("sessionNotFound");
          }
          await token.destroy();

          const user = await User.findByPk(decoded.id);
          if (!user) {
            return next(new HTTP404Error("userNotFound"));
          }
          return res
            .status(HttpStatusCode.OK)
            .json({ message: req.t("loggedOut", { lng: user.language }) });
        } catch (error) {
          next(error);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/forgotPassword:
   *   post:
   *     summary: Request a password reset
   *     tags: [Auth]
   *     security: []
   *     description: This endpoint is used to request a password reset. The user will receive an email with a link to reset their password.
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *        schema:
   *          type: object
   *          required:
   *            - email
   *     responses:
   *       200:
   *         description: Password reset link sent to email
   *       400:
   *         description: Bad request. Possible reasons include missing email in the request body.
   *       404:
   *         description: User not found. Indicates that the user with the provided email does not exist.
   *       500:
   *         description: Server error. Something went wrong on the server.
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        throw new HTTP400Error("emailIsRequired");
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new HTTP404Error("userNotFound");
      }
      const passwordResetToken = await generatePasswordResetToken(user);
      user.update({
        passwordResetToken: await bcrypt.hash(passwordResetToken, 12),
      });
      MailService.sendResetPasswordMail(user, passwordResetToken);
      return res
        .status(HttpStatusCode.OK)
        .json({ message: req.t("resetLinkSent", { lng: user.language }) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/auth/resetPassword:
   *   post:
   *     summary: Reset a user's password
   *     tags: [Auth]
   *     security: []
   *     description: This endpoint is used to reset a user's password. The user must provide a valid password reset token in the query string and a new password in the request body.
   *     parameters:
   *     - in: query
   *       name: token
   *     requestBody:
   *       required: true
   *       content:
   *        application/json:
   *          schema:
   *            type: object
   *            required:
   *              - password
   *            properties:
   *              password:
   *                type: string
   *     responses:
   *       200:
   *         description: Password reset link sent to email
   *       400:
   *         description: Bad request. Possible reasons include missing password in the request body.
   *       401:
   *         description: Unauthorized. Indicates that the provided token is invalid or expired.
   *       404:
   *         description: User not found. Indicates that the user with the provided email does not exist.
   *       500:
   *         description: Server error. Something went wrong on the server.
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;
      const { password } = req.body;

      if (!token) {
        throw new HTTP400Error("tokenIsRequired");
      }
      if (!password) {
        throw new HTTP400Error("passwordIsRequired");
      }

      await jwt.verify(token, PASSWORD_RESET_SECRET, async (err, decoded) => {
        if (err) {
          throw new HTTP401Error("invalidToken");
        }
        const user = await User.findByPk(decoded.id);
        if (!user) {
          throw new HTTP404Error("userNotFound");
        }
        // Check if any of the user's tokens match the provided token
        const tokenIsValid = await bcrypt.compare(
          token,
          user.passwordResetToken || ""
        );
        if (!tokenIsValid) {
          throw new HTTP401Error("tokenMismatch");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await user
          .update({
            password: hashedPassword,
          })
          .then(async (user) => {
            logger.info(`User password reset: ${user.email}`);
            user.update({ passwordResetToken: null });
            return res.status(HttpStatusCode.OK).json({
              message: req.t("passwordResetSuccessfully", {
                lng: user.language,
              }),
            });
          })
          .catch((error) => {
            next(error);
          });
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
