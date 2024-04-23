import { NextFunction, Request, Response } from "express";
import Unit from "@/models/Unit"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error, HTTP409Error } from "@/utils/error"; // Adjust the path as necessary
import { Op } from "sequelize";
import logger from "@/config/winston";

class UnitController {
  /**
   * @swagger
   * tags:
   *   name: Unit
   *   description: API for Units
   * /api/v1/units:
   *   post:
   *     summary: Create a new unit
   *     tags: [Unit]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *                - name
   *             properties:
   *                name:
   *                  type: string
   *     responses:
   *       201:
   *         description: Unit created successfully.
   *       400:
   *         description: Bad request
   *       409:
   *         description: Another unit with the name already exists
   */
  static async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;
      if (!name) {
        throw new HTTP400Error("theNameFieldIsRequired");
      }

      // Check if the unit already exists
      const existingUnit = await Unit.findOne({ where: { name } });
      if (existingUnit) {
        throw new HTTP409Error("aUnitWithThisNameAlreadyExists");
      }

      return await Unit.create({ name })
        .then((unit) => {
          logger.info(`Unit created: ${unit.name}`);
          return res.status(201).json(unit);
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
   * tags:
   *   name: Unit
   *   description: API for Units
   * /api/v1/units:
   *   get:
   *     summary: Get all units
   *     tags: [Unit]
   *     responses:
   *       200:
   *         description: A list of units.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Unit'
   */
  static async getAllUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const units = await Unit.findAll();
      logger.info(`Retrieved ${units.length} units`);
      return res.json(units);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * tags:
   *   name: Unit
   *   description: API for Units
   * /api/v1/units/{id}:
   *   get:
   *     summary: Get a unit by id
   *     tags: [Unit]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: The id of the unit to get
   *     responses:
   *       200:
   *         description: Details about a unit.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Unit'
   *       404:
   *         description: Unit not found
   */
  static async getUnitById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const unit = await Unit.findByPk(id);
      if (!unit) {
        throw new HTTP404Error("unitNotFound");
      }
      logger.info(`Retrieved unit: ${unit.name}`);
      return res.json(unit);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * tags:
   *   name: Unit
   *   description: API for Units
   * /api/v1/units/{id}:
   *   put:
   *     summary: Update a unit
   *     tags: [Unit]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: The id of the unit to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Unit'
   *     responses:
   *       200:
   *         description: Unit updated successfully.
   *       404:
   *         description: Unit not found
   *       409:
   *         description: Another unit with the name already exists
   */
  static async updateUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      if (!name) {
        throw new HTTP400Error("theNameFieldIsRequired");
      }

      // Check if another unit with the new name already exists (excluding the current unit)
      const existingUnit = await Unit.findOne({
        where: {
          name,
          id: { [Op.ne]: id }, // Op.ne is Sequelize's operator for "not equal"
        },
      });
      if (existingUnit) {
        throw new HTTP409Error("aUnitWithThisNameAlreadyExists");
      }

      const unit = await Unit.findByPk(id);
      if (!unit) {
        throw new HTTP404Error("unitNotFound");
      }

      unit.name = name;
      return await unit
        .save()
        .then((unit) => {
          logger.info(`Unit updated: ${unit.name}`);
          return res.json(unit);
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
   * tags:
   *   name: Unit
   *   description: API for Units
   * /api/v1/units/{id}:
   *   delete:
   *     summary: Delete a unit by id
   *     tags: [Unit]
   *     parameters:
   *      - in: path
   *        name: id
   *        schema:
   *          type: integer
   *        required: true
   *        description: The id of the unit to delete
   *     responses:
   *       200:
   *         description: Deleted unit.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Unit'
   *       404:
   *         description: Unit not found
   */
  static async deleteUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const unit = await Unit.findByPk(id);
      if (!unit) {
        throw new HTTP404Error("unitNotFound");
      }
      await unit.destroy();
      logger.info(`Deleted unit: ${unit.name}`);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default UnitController;
