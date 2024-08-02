import { Request, Response, NextFunction } from "express";
import Session from "@/models/Session"; // Adjust the path as necessary
import { HTTP400Error, HTTP403Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import { Role } from "@/types/enums/Role";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import DataResponse from "@/types/classes/DataResponse";
import PaginationResponse from "@/types/classes/PaginationResponse";
import checkPermission from "@/middleware/CheckPermission";
import { parseFilterString } from "@/utils/helpers";

class SessionController {
  /**
   * @swagger
   * /api/v1/sessions:
   *   post:
   *     summary: Create a new session
   *     tags: [Session]
   *     description: Create a new session with a specified start and end time.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - sessionStart
   *               - sessionEnd
   *             properties:
   *               sessionStart:
   *                 type: string
   *                 format: date-time
   *                 description: ISO 8601 formatted date-time string representing the start of the session.
   *               sessionEnd:
   *                 type: string
   *                 format: date-time
   *                 description: ISO 8601 formatted date-time string representing the end of the session.
   *     responses:
   *       201:
   *         description: Session created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 201
   *                 message:
   *                   type: string
   *                   example: "Session created successfully."
   *                 data:
   *                   $ref: '#/components/schemas/Session'
   *       400:
   *         description: Bad request, such as missing required fields or improper date format.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 400
   *                 message:
   *                   type: string
   *                   example: "Bad Request due to input validation failure."
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
          return res
            .status(HttpStatusCode.CREATED)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.CREATED,
                "sessionCreated",
                session
              )
            );
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
   *     summary: Retrieve a paginated list of sessions
   *     tags: [Session]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number of the session list
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of sessions per page
   *       - in: query
   *         name: filter
   *         schema:
   *           type: string
   *         description: JSON string containing filter criteria
   *     responses:
   *       200:
   *         description: A paginated list of sessions retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       400:
   *         description: Invalid input, details in error message
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getAllSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const filterString = req.query.filter as string;
      const filters = parseFilterString(filterString);
      await checkPermission(req, filters.userId);
      const { count, rows } = await Session.findAndCountAll({
        offset,
        limit,
        attributes: { exclude: ["userId"] },
      });
      const totalPages = Math.ceil(count / limit);
      logger.info(`Retrieved ${count} sessions`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.OK,
            "sessionsRetrieved",
            rows,
            new PaginationResponse(page, totalPages, count)
          )
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions/{id}:
   *   get:
   *     summary: Retrieve details of a session by ID
   *     tags: [Session]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The unique identifier of the session to retrieve.
   *     responses:
   *       200:
   *         description: Detailed information about the session.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       403:
   *         description: Access denied - User does not have permission to access this session.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: No session found corresponding to the specified ID.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getSessionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFound");
      }
      await checkPermission(req, session.userId);
      logger.info(`Retrieved session: ${session.id}`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(req, HttpStatusCode.OK, "sessionRetrieved", session)
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/sessions/{id}:
   *   put:
   *     summary: Update a session's details
   *     tags: [Session]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The unique identifier of the session to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               sessionStart:
   *                 type: string
   *                 format: date-time
   *                 description: The start time of the session.
   *               sessionEnd:
   *                 type: string
   *                 format: date-time
   *                 description: The end time of the session.
   *     responses:
   *       200:
   *         description: Successfully updated the session details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       400:
   *         description: Bad request due to invalid input data.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Unauthorized access, user does not have permission to update this session.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: The session with the specified ID was not found.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async updateSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sessionStart, sessionEnd } = req.body;

      let session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFound");
      }
      await checkPermission(req, session.userId);
      return await session
        .update({ sessionStart, sessionEnd })
        .then((session) => {
          logger.info(`Session updated: ${session.id}`);
          return res
            .status(HttpStatusCode.OK)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.OK,
                "sessionUpdated",
                session
              )
            );
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
      const session = await Session.findByPk(id);
      if (!session) {
        throw new HTTP404Error("sessionNotFoun");
      }
      await checkPermission(req, session.userId);
      await session.destroy();
      logger.info(`Session deleted: ${id}`);
      return res.status(HttpStatusCode.NO_CONTENT).send(); // No content to send back, indicating successful deletion
    } catch (error) {
      next(error);
    }
  }
}

export default SessionController;
