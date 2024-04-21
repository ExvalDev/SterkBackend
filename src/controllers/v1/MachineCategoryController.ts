import { Request, Response, NextFunction } from "express";
import MachineCategory from "@/models/MachineCategory"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import { log } from "winston";

class MachineCategoryController {
  /**
   * @swagger
   * tags:
   *   name: MachineCategory
   *   description: API for Machine Category
   * /api/v1/machinecategories:
   *   post:
   *     summary: Create a new machine category
   *     tags: [MachineCategory]
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
   *     responses:
   *       201:
   *         description: Machine category created successfully
   *       400:
   *         description: Bad request
   */
  static async createMachineCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { name } = req.body;
      return await MachineCategory.create({ name })
        .then((category) => {
          logger.info(`Machine category created: ${category.name}`);
          return res.status(201).json(category);
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
   * /api/v1/machinecategories:
   *   get:
   *     summary: Get all machine categories
   *     tags: [MachineCategory]
   *     responses:
   *       200:
   *         description: A list of machine categories
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MachineCategory'
   */
  static async getAllMachineCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const categories = await MachineCategory.findAll();
      logger.info(`Retrieved ${categories.length} machine categories`);
      return res.json(categories);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/machinecategories/{id}:
   *   get:
   *     summary: Get a machine category by ID
   *     tags: [MachineCategory]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine category to get
   *     responses:
   *       200:
   *         description: Machine category details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MachineCategory'
   *       404:
   *         description: Machine category not found
   */
  static async getMachineCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const category = await MachineCategory.findByPk(id);
      if (!category) {
        throw new HTTP404Error("Machine category not found");
      }
      logger.info(`Retrieved machine category: ${category.name}`);
      return res.json(category);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/machinecategories/{id}:
   *   put:
   *     summary: Update a machine category
   *     tags: [MachineCategory]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine category to update
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
   *     responses:
   *       200:
   *         description: Machine category updated successfully
   *       404:
   *         description: Machine category not found
   */
  static async updateMachineCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      let category = await MachineCategory.findByPk(id);
      if (!category) {
        throw new HTTP404Error("Machine category not found");
      }

      return await category
        .update({ name })
        .then((category) => {
          logger.info(`Updated machine category: ${category.name}`);
          return res.json(category);
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
   * /api/v1/machinecategories/{id}:
   *   delete:
   *     summary: Delete a machine category by ID
   *     tags: [MachineCategory]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine category to delete
   *     responses:
   *       204:
   *         description: Machine category deleted successfully
   *       404:
   *         description: Machine category not found
   */
  static async deleteMachineCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const category = await MachineCategory.findByPk(id);
      if (!category) {
        throw new HTTP404Error("Machine category not found");
      }

      await category.destroy();
      logger.info(`Deleted machine category: ${category.name}`);
      return res.status(204).send(); // No content to send back, indicating successful deletion
    } catch (error) {
      next(error);
    }
  }
}

export default MachineCategoryController;
