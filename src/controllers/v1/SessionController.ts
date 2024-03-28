import { Request, Response, NextFunction } from "express";
import Session from "@/models/Session"; // Adjust the path as necessary
import { HTTP404Error } from "@/util/error"; // Adjust the path as necessary
import logger from "@/config/winston";

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
      const newSession = await Session.create({ sessionStart, sessionEnd });
      logger.info(`Session created: ${newSession.id}`);
      return res.status(201).json(newSession);
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
   *       404:
   *         description: Session not found
   */
  static async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("Session not found");
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
   *       404:
   *         description: Session not found
   */
  static async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sessionStart, sessionEnd } = req.body;

      let session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("Session not found");
      }
      session = await session.update({ sessionStart, sessionEnd });
      logger.info(`Session updated: ${session.id}`);
      return res.json(session);
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
   *       404:
   *         description: Session not found
   */
  static async deleteSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("Session not found");
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
