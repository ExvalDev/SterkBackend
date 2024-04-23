import { Request, Response, NextFunction } from "express";
import Session from "@/models/Session"; // Adjust the path as necessary
import { HTTP400Error, HTTP403Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import { Role } from "@/types/Role";

class SessionController {
  /**
   * @swagger
   * tags:
   *   name: Session
   *   description: API for Sessions
   * /api/v1/sessions:
   *   post:
   *     summary: Create a new session
   *     tags: [Session]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              sessionStart:
   *                type: string
   *                format: date-time
   *              sessionEnd:
   *                type: string
   *                format: date-time
   *     responses:
   *       201:
   *         description: Session created successfully
   *       400:
   *         description: Bad request
   */
  static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionStart, sessionEnd } = req.body;
      return await Session.create({
        sessionStart,
        sessionEnd,
        userId: req.body.user.id,
      })
        .then((session) => {
          logger.info(`Session created: ${session.id}`);
          return res.status(201).json(session);
        })
        .catch((error) => {
          throw new HTTP400Error("Bad Request", error);
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions:
   *   get:
   *     summary: Get all sessions
   *     tags: [Session]
   *     responses:
   *       200:
   *         description: A list of sessions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Session'
   */
  static async getAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await Session.findAll();
      logger.info(`Retrieved ${sessions.length} sessions`);
      return res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /sessions/user:
   *   get:
   *     summary: Retrieves all sessions associated with a specific user
   *     tags: [Session]
   *     responses:
   *       200:
   *         description: An array of sessions
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     description: The session ID
   *                     example: 1
   *                   sessionStart:
   *                     type: string
   *                     format: date-time
   *                     description: The start of the session
   *                   sessionEnd:
   *                     type: string
   *                     format: date-time
   *                     description: The end of the session
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                     description: The time the session was created
   *                   updatedAt:
   *                     type: string
   *                     format: date-time
   *                     description: The time the session was last updated
   *       400:
   *         description: Bad Request
   *       404:
   *         description: User ID not found
   *       500:
   *         description: Internal Server Error
   *     security:
   *       - bearerAuth: []
   */
  static async getSessionsByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body.user;
      const sessions = await Session.findAll({
        where: { userId: id },
        attributes: { exclude: ["userId"] },
      });
      logger.info(`Retrieved ${sessions.length} sessions for user: ${id}`);
      return res.json(sessions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions/{id}:
   *   get:
   *     summary: Get a session by ID
   *     tags: [Session]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the session to get
   *     responses:
   *       200:
   *         description: Session details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Session'
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Session not found
   */
  static async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFound");
      }
      if (
        session.userId !== req.body.user.id &&
        req.body.user.role !== Role.ADMIN
      ) {
        throw new HTTP403Error("youDoNotHaveAccessToThisResource");
      }
      logger.info(`Retrieved session: ${session.id}`);
      return res.json(session);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions/{id}:
   *   put:
   *     summary: Update a session
   *     tags: [Session]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the session to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            properties:
   *              sessionStart:
   *                type: string
   *                format: date-time
   *              sessionEnd:
   *                type: string
   *                format: date-time
   *     responses:
   *       200:
   *         description: Session updated successfully
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Session not found
   */
  static async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sessionStart, sessionEnd } = req.body;

      let session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFoun");
      }
      if (
        session.userId !== req.body.user.id &&
        req.body.user.role !== Role.ADMIN
      ) {
        throw new HTTP403Error("youDoNotHaveAccessToThisResource");
      }
      return await session
        .update({ sessionStart, sessionEnd })
        .then((session) => {
          logger.info(`Session updated: ${session.id}`);
          return res.json(session);
        })
        .catch((error) => {
          throw new HTTP400Error("Bad Request", error);
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions/{id}:
   *   delete:
   *     summary: Delete a session by ID
   *     tags: [Session]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the session to delete
   *     responses:
   *       204:
   *         description: Session deleted successfully
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Session not found
   */
  static async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.body.user;
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFoun");
      }
      if (session.userId !== user.id && user.role !== Role.ADMIN) {
        throw new HTTP403Error("youDoNotHaveAccessToThisResource");
      }
      await session.destroy();
      logger.info(`Session deleted: ${id}`);
      return res.status(204).send(); // No content to send back, indicating successful deletion
    } catch (error) {
      next(error);
    }
  }
}

export default SessionController;
