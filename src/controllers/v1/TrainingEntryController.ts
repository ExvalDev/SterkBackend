import { NextFunction, Request, Response } from "express";
import TrainingEntry from "@/models/TrainingEntry"; // Adjust the path as necessary
import { HTTP400Error, HTTP403Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import Unit from "@/models/Unit";
import { Role } from "@/types/Role";

class TrainingEntryController {
  /**
   * @swagger
   * tags:
   *   name: TrainingEntry
   *   description: API for Training Entry
   * /api/v1/trainingEntry:
   *   post:
   *     summary: Create a new training entry
   *     tags: [TrainingEntry]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - value
   *              - unitId
   *              - machineId
   *              - sessionId
   *            properties:
   *              value:
   *                type: number
   *              unitId:
   *                type: integer
   *              machineId:
   *                type: integer
   *              sessionId:
   *                type: integer
   *     responses:
   *       201:
   *         description: Training entry created successfully
   *       400:
   *         description: Bad request
   */
  static async createTrainingEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { value, unitId, machineId, sessionId } = req.body;
      return await TrainingEntry.create({
        value,
        unitId,
        machineId,
        sessionId,
        userId: req.body.user.id,
      })
        .then(async (trainingEntry) => {
          const trainingEntryWithUnit = await TrainingEntry.findByPk(
            trainingEntry.id,
            {
              include: [
                {
                  model: Unit,
                },
              ],
              attributes: { exclude: ["userId"] },
            }
          );
          logger.info(`Training data created: ${trainingEntry.id}`);
          return res.status(201).json(trainingEntryWithUnit);
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
   * /api/v1/trainingEntry:
   *   get:
   *     summary: Get all training entries
   *     tags: [TrainingEntry]
   *     responses:
   *       200:
   *         description: A list of training entries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TrainingEntry'
   */
  static async getAllTrainingEntries(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const trainingEntries = await TrainingEntry.findAll({
        include: [{ model: Unit }],
        attributes: { exclude: ["userId"] },
      });
      logger.info(`Retrieved ${trainingEntries.length} training data entries`);
      return res.json(trainingEntries);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /trainingEntry/user:
   *   get:
   *     summary: Retrieves all training entries associated with a specific user
   *     tags: [TrainingEntry]
   *     responses:
   *       200:
   *         description: An array of training data entries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TrainingEntry'
   */
  static async getTrainingEntriesByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body.user;
      const trainingEntries = await TrainingEntry.findAll({
        where: { userId: id },
        attributes: { exclude: ["userId"] },
        include: [{ model: Unit }],
      });
      logger.info(
        `Retrieved ${trainingEntries.length} training data entries for user ${id}`
      );
      return res.json(trainingEntries);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/trainingEntry/{id}:
   *   get:
   *     summary: Get a training data entry by ID
   *     tags: [TrainingEntry]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the training entry to get
   *     responses:
   *       200:
   *         description: Training entry details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TrainingEntry'
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Training data not found
   */
  static async getTrainingEntryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const trainingEntry = await TrainingEntry.findByPk(id, {
        include: [{ model: Unit }],
        attributes: { exclude: ["userId"] },
      });
      if (!trainingEntry) {
        throw new HTTP404Error("TrainingEntry not found");
      }

      if (
        trainingEntry.userId !== req.body.user.id &&
        req.body.user.role !== Role.ADMIN
      ) {
        throw new HTTP403Error("You do not have access to this resource.");
      }

      logger.info(`Retrieved training data: ${trainingEntry.id}`);
      return res.json(trainingEntry);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/trainingEntry/{id}:
   *   put:
   *     summary: Update a training entry
   *     tags: [TrainingEntry]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the training entry to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - value
   *              - unitId
   *              - machineId
   *              - sessionId
   *            properties:
   *              value:
   *                type: number
   *              unitId:
   *                type: integer
   *              machineId:
   *                type: integer
   *              sessionId:
   *                type: integer
   *     responses:
   *       200:
   *         description: Training Entry updated successfully
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Training Entry not found
   */
  static async updateTrainingEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { value, unitId, machineId, sessionId } = req.body;

      const trainingEntry = await TrainingEntry.findByPk(id, {
        include: [{ model: Unit }],
        attributes: { exclude: ["userId"] },
      });
      if (!trainingEntry) {
        throw new HTTP404Error("TrainingEntry not found");
      }
      if (
        trainingEntry.userId !== req.body.user.id &&
        req.body.user.role !== Role.ADMIN
      ) {
        throw new HTTP403Error("You do not have access to this resource.");
      }

      trainingEntry.value = value ?? trainingEntry.value;
      trainingEntry.unitId = unitId ?? trainingEntry.unitId;
      trainingEntry.machineId = machineId ?? trainingEntry.machineId;
      trainingEntry.sessionId = sessionId ?? trainingEntry.sessionId;

      return await trainingEntry
        .save()
        .then(async (trainingEntry) => {
          const trainingEntryWithUnit = await TrainingEntry.findByPk(
            trainingEntry.id,
            {
              include: [
                {
                  model: Unit,
                },
              ],
              attributes: { exclude: ["userId"] },
            }
          );
          logger.info(`Training data updated: ${trainingEntry.id}`);
          return res.json(trainingEntryWithUnit);
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
   * /api/v1/trainingEntry/{id}:
   *   delete:
   *     summary: Delete a Training Entry entry by ID
   *     tags: [TrainingEntry]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the Training Entry to delete
   *     responses:
   *       204:
   *         description: Training Entry deleted successfully
   *       403:
   *         description: You do not have access to this resource.
   *       404:
   *         description: Training Entry not found
   */
  static async deleteTrainingEntry(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const trainingEntry = await TrainingEntry.findByPk(id);
      if (!trainingEntry) {
        throw new HTTP404Error("TrainingEntry not found");
      }
      if (
        trainingEntry.userId !== req.body.user.id &&
        req.body.user.role !== Role.ADMIN
      ) {
        throw new HTTP403Error("You do not have access to this resource.");
      }

      await trainingEntry.destroy();
      logger.info(`Deleted training data: ${id}`);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default TrainingEntryController;
