import { NextFunction, Request, Response } from "express";
import TrainingData from "@/models/TrainingData"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/util/error"; // Adjust the path as necessary
import logger from "@/config/winston";

class TrainingDataController {
  /**
   * @swagger
   * tags:
   *   name: TrainingData
   *   description: API for Training Data
   * /api/v1/trainingdata:
   *   post:
   *     summary: Create a new training data entry
   *     tags: [TrainingData]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - value
   *              - unitId
   *              - machineCategoryId
   *              - sessionId
   *            properties:
   *              value:
   *                type: number
   *              unitId:
   *                type: integer
   *              machineCategoryId:
   *                type: integer
   *              sessionId:
   *                type: integer
   *     responses:
   *       201:
   *         description: Training data created successfully
   *       400:
   *         description: Bad request
   */
  static async createTrainingData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { value, unitId, machineCategoryId, sessionId } = req.body;
      return await TrainingData.create({
        value,
        unitId,
        machineCategoryId,
        sessionId,
      })
        .then((trainingData) => {
          logger.info(`Training data created: ${trainingData.id}`);
          return res.status(201).json(trainingData);
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
   * /api/v1/trainingdata:
   *   get:
   *     summary: Get all training data entries
   *     tags: [TrainingData]
   *     responses:
   *       200:
   *         description: A list of training data entries
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/TrainingData'
   */
  static async getAllTrainingData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const trainingDataEntries = await TrainingData.findAll();
      logger.info(
        `Retrieved ${trainingDataEntries.length} training data entries`
      );
      return res.json(trainingDataEntries);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/trainingdata/{id}:
   *   get:
   *     summary: Get a training data entry by ID
   *     tags: [TrainingData]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the training data to get
   *     responses:
   *       200:
   *         description: Training data entry details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/TrainingData'
   *       404:
   *         description: Training data not found
   */
  static async getTrainingDataById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const trainingData = await TrainingData.findByPk(id);

      if (!trainingData) {
        throw new HTTP404Error("TrainingData not found");
      }
      logger.info(`Retrieved training data: ${trainingData.id}`);
      return res.json(trainingData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/trainingdata/{id}:
   *   put:
   *     summary: Update a training data entry
   *     tags: [TrainingData]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the training data to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - value
   *              - unitId
   *              - machineCategoryId
   *              - sessionId
   *            properties:
   *              value:
   *                type: number
   *              unitId:
   *                type: integer
   *              machineCategoryId:
   *                type: integer
   *              sessionId:
   *                type: integer
   *     responses:
   *       200:
   *         description: Training data updated successfully
   *       404:
   *         description: Training data not found
   */
  static async updateTrainingData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { value, unitId, machineCategoryId, sessionId } = req.body;

      const trainingData = await TrainingData.findByPk(id);
      if (!trainingData) {
        throw new HTTP404Error("TrainingData not found");
      }

      trainingData.value = value ?? trainingData.value;
      trainingData.unitId = unitId ?? trainingData.unitId;
      trainingData.machineCategoryId =
        machineCategoryId ?? trainingData.machineCategoryId;
      trainingData.sessionId = sessionId ?? trainingData.sessionId;

      return await trainingData
        .save()
        .then((trainingData) => {
          logger.info(`Training data updated: ${trainingData.id}`);
          return res.json(trainingData);
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
   * /api/v1/trainingdata/{id}:
   *   delete:
   *     summary: Delete a training data entry by ID
   *     tags: [TrainingData]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: ID of the training data to delete
   *     responses:
   *       204:
   *         description: Training data deleted successfully
   *       404:
   *         description: Training data not found
   */
  static async deleteTrainingData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const trainingData = await TrainingData.findByPk(id);
      if (!trainingData) {
        throw new HTTP404Error("TrainingData not found");
      }

      await trainingData.destroy();
      logger.info(`Deleted training data: ${id}`);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default TrainingDataController;
