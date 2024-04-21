import { Request, Response, NextFunction } from "express";
import Machine from "@/models/Machine"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import NFCTag from "@/models/NFCTag";

class MachineController {
  /**
   * @swagger
   * tags:
   *   name: Machine
   *   description: API for Machines
   * /api/v1/machines:
   *   post:
   *     summary: Create a new machine
   *     tags: [Machine]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *              - machineCategoryId
   *              - nfcTagId
   *              - studioId
   *            properties:
   *              name:
   *                type: string
   *              machineCategoryId:
   *                type: integer
   *              nfcTagId:
   *                type: integer
   *              studioId:
   *                type: integer
   *     responses:
   *       201:
   *         description: Machine created successfully.
   *       400:
   *         description: Bad request.
   */
  static async createMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, machineCategoryId, nfcTagId, studioId } = req.body;
      return await Machine.create({
        name,
        machineCategoryId,
        nfcTagId,
        studioId,
      })
        .then((machine) => {
          logger.info(`Machine created: ${machine.name}`);
          return res.status(201).json(machine);
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
   * /api/v1/machines:
   *   get:
   *     summary: Get all machines
   *     tags: [Machine]
   *     responses:
   *       200:
   *         description: A list of machines.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Machine'
   */
  static async getAllMachines(req: Request, res: Response, next: NextFunction) {
    try {
      const machines = await Machine.findAll({
        include: [
          {
            model: NFCTag,
            as: "nfcTag",
          },
        ],
      });
      logger.info(`Retrieved ${machines.length} machines`);
      return res.json(machines);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/machines/{id}:
   *   get:
   *     summary: Get a machine by ID
   *     tags: [Machine]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: ID of the machine to get
   *     responses:
   *       200:
   *         description: Machine details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Machine'
   *       404:
   *         description: Machine not found.
   */
  static async getMachineById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const machine = await Machine.findByPk(id, {
        include: [
          {
            model: NFCTag,
            as: "nfcTag",
          },
        ],
      });
      if (!machine) {
        throw new HTTP404Error("Machine not found");
      }
      logger.info(`Retrieved machine: ${machine.name}`);
      return res.json(machine);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/machines/{id}:
   *   put:
   *     summary: Update a machine
   *     tags: [Machine]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: ID of the machine to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - name
   *              - machineCategoryId
   *              - nfcTagId
   *              - studioId
   *            properties:
   *              name:
   *                type: string
   *              machineCategoryId:
   *                type: integer
   *              nfcTagId:
   *                type: integer
   *              studioId:
   *                type: integer
   *     responses:
   *       200:
   *         description: Machine updated successfully.
   *       404:
   *         description: Machine not found.
   */
  static async updateMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, machineCategoryId, nfcTagId, studioId } = req.body;

      let machine = await Machine.findByPk(id);
      if (!machine) {
        throw new HTTP404Error("Machine not found");
      }

      return await machine
        .update({
          name,
          machineCategoryId,
          nfcTagId,
          studioId,
        })
        .then((machine) => {
          logger.info(`Machine updated: ${machine.name}`);
          return res.json(machine);
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
   * /api/v1/machines/{id}:
   *   delete:
   *     summary: Delete a machine by ID
   *     tags: [Machine]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine to delete
   *     responses:
   *       204:
   *         description: Machine deleted successfully.
   *       404:
   *         description: Machine not found.
   */
  static async deleteMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const machine = await Machine.findByPk(id);
      if (!machine) {
        throw new HTTP404Error("Machine not found");
      }
      await machine.destroy();
      logger.info(`Deleted machine: ${machine.name}`);
      return res.status(204).send(); // No content to send back
    } catch (error) {
      next(error);
    }
  }
}

export default MachineController;
