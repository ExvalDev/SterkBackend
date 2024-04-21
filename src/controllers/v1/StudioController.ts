import { Request, Response, NextFunction } from "express";
import Studio from "@/models/Studio"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";

class StudioController {
  /**
   * @swagger
   * tags:
   *   name: Studio
   *   description: API for Studios
   * /api/v1/studios:
   *   post:
   *     summary: Create a new studio
   *     tags: [Studio]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *            properties:
   *              name:
   *                type: string
   *              street:
   *                type: string
   *              houseNumber:
   *                type: string
   *              city:
   *                type: string
   *              zip:
   *                type: string
   *     responses:
   *       201:
   *         description: Studio created successfully.
   *       400:
   *         description: Bad request.
   */
  static async createStudio(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, street, houseNumber, city, zip } = req.body;
      return await Studio.create({ name })
        .then((studio) => {
          logger.info(`Studio created: ${studio.name}`);
          return res.status(201).json(studio);
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
   * /api/v1/studios:
   *   get:
   *     summary: Get all studios
   *     tags: [Studio]
   *     responses:
   *       200:
   *         description: A list of studios.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Studio'
   */
  static async getAllStudios(req: Request, res: Response, next: NextFunction) {
    try {
      const studios = await Studio.findAll();
      logger.info(`Retrieved ${studios.length} studios`);
      return res.json(studios);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/studios/{id}:
   *   get:
   *     summary: Get a studio by ID
   *     tags: [Studio]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the studio to get
   *     responses:
   *       200:
   *         description: Studio details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Studio'
   *       404:
   *         description: Studio not found.
   */
  static async getStudioById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const studio = await Studio.findByPk(id);
      if (!studio) {
        throw new HTTP404Error("Studio not found");
      }
      logger.info(`Retrieved studio: ${studio.name}`);
      return res.json(studio);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/studios/{id}:
   *   put:
   *     summary: Update a studio
   *     tags: [Studio]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the studio to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *            properties:
   *              name:
   *                type: string
   *              street:
   *                type: string
   *              houseNumber:
   *                type: string
   *              city:
   *                type: string
   *              zip:
   *                type: string
   *     responses:
   *       200:
   *         description: Studio updated successfully.
   *       404:
   *         description: Studio not found.
   */
  static async updateStudio(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, street, houseNumber, city, zip } = req.body;

      let studio = await Studio.findByPk(id);
      if (!studio) {
        throw new HTTP404Error("Studio not found");
      }

      return await studio
        .update({ name, street, houseNumber, city, zip })
        .then((studio) => {
          logger.info(`Updated studio: ${studio.name}`);
          return res.json(studio);
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
   * /api/v1/studios/{id}:
   *   delete:
   *     summary: Delete a studio by ID
   *     tags: [Studio]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the studio to delete
   *     responses:
   *       204:
   *         description: Studio deleted successfully.
   *       404:
   *         description: Studio not found.
   */
  static async deleteStudio(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const studio = await Studio.findByPk(id);
      if (!studio) {
        throw new HTTP404Error("Studio not found");
      }

      await studio.destroy();
      logger.info(`Deleted studio: ${id}`);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default StudioController;
