import { Request, Response, NextFunction } from "express";
import MachineCategory from "@/models/MachineCategory"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import DataResponse from "@/types/classes/DataResponse";
import PaginationResponse from "@/types/classes/PaginationResponse";

class MachineCategoryController {
  /**
   * @swagger
   * tags:
   *   name: MachineCategory
   *   description: API for managing machine categories
   * /api/v1/machinecategories:
   *   post:
   *     summary: Create a new machine category
   *     tags: [MachineCategory]
   *     description: This endpoint creates a new machine category with a given name.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the machine category to be created.
   *     responses:
   *       201:
   *         description: Machine category created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       400:
   *         description: Bad request. This can occur due to invalid input data.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   * components:
   *   schemas:
   *     DataResponse:
   *       type: object
   *       properties:
   *         httpCode:
   *           type: integer
   *           example: 201
   *         message:
   *           type: string
   *           example: "Machine category created successfully."
   *         data:
   *           type: object
   *           properties:
   *             id:
   *               type: integer
   *             name:
   *               type: string
   *     Error:
   *       type: object
   *       properties:
   *         httpCode:
   *           type: integer
   *           example: 400
   *         message:
   *           type: string
   *           example: "Bad request due to invalid input data."
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
          return res
            .status(HttpStatusCode.CREATED)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.CREATED,
                "machineCategoryCreated",
                category
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
   * /api/v1/machinecategories:
   *   get:
   *     summary: Get all machine categories
   *     tags: [MachineCategory]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: The page number to retrieve
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: The number of items per page
   *     responses:
   *       200:
   *         description: A list of machine categories along with pagination details
   *         content:
   *           application/json:
   *              schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       400:
   *         description: Bad request due to incorrect parameters or invalid inputs
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  static async getAllMachineCategories(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      const { count, rows } = await MachineCategory.findAndCountAll({
        limit: limit,
        offset: offset,
        order: [["id", "ASC"]],
      });
      const totalPages = Math.ceil(count / limit);
      logger.info(`Retrieved ${count} machine categories`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.OK,
            "machineCategoriesRetrieved",
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
   *               $ref: '#/components/schemas/DataResponse'
   *       404:
   *         description: Machine category not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        throw new HTTP404Error("machineCategoryNotFound");
      }
      logger.info(`Retrieved machine category: ${category.name}`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.OK,
            "machineCategoryRetrieved",
            category
          )
        );
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
   *             type: object
   *             required:
   *               - name
   *             properties:
   *               name:
   *                 type: string
   *                 description: The new name of the machine category.
   *     responses:
   *       200:
   *         description: Machine category updated successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DataResponse'
   *       400:
   *         description: Invalid input, details in payload.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Machine category not found.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        throw new HTTP404Error("machineCategoryNotFound");
      }

      return await category
        .update({ name })
        .then((category) => {
          logger.info(`Updated machine category: ${category.name}`);
          return res
            .status(HttpStatusCode.OK)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.OK,
                "machineCategoryUpdated",
                category
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
   *         description: Machine category deleted successfully, no content returned.
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
        throw new HTTP404Error("machineCategoryNotFound");
      }

      await category.destroy();
      logger.info(`Deleted machine category: ${category.name}`);
      return res
        .status(HttpStatusCode.NO_CONTENT)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.NO_CONTENT,
            "machineCategoryDeleted"
          )
        ); // No content to send back, indicating successful deletion
    } catch (error) {
      next(error);
    }
  }
}

export default MachineCategoryController;
