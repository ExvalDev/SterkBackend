import { Request, Response, NextFunction } from "express";
import Machine from "@/models/Machine"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import NFCTag from "@/models/NFCTag";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import DataResponse from "@/types/classes/DataResponse";
import PaginationResponse from "@/types/classes/PaginationResponse";

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
   *             type: object
   *             required:
   *               - name
   *               - machineCategoryId
   *               - nfcTagId
   *               - studioId
   *             properties:
   *               name:
   *                 type: string
   *                 description: Name of the machine.
   *               machineCategoryId:
   *                 type: integer
   *                 description: Identifier for the machine category.
   *               nfcTagId:
   *                 type: integer
   *                 description: NFC tag associated with the machine.
   *               studioId:
   *                 type: integer
   *                 description: Identifier for the studio where the machine is located.
   *     responses:
   *       201:
   *         description: Machine created successfully.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Machine'
   *       400:
   *         description: Bad request. Possible reasons include missing required fields, invalid field formats, or validation errors.
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
          return res
            .status(HttpStatusCode.CREATED)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.CREATED,
                "machineCreated",
                machine
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
   * /api/v1/machines:
   *   get:
   *     summary: Get all machines
   *     tags: [Machine]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number of the machines list
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of machines per page
   *     responses:
   *       200:
   *         description: A paginated list of machines along with pagination details.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Machine'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationResponse'
   */
  static async getAllMachines(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const { count, rows } = await Machine.findAndCountAll({
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: NFCTag,
            as: "nfcTag",
          },
        ],
      });
      const totalPages = Math.ceil(count / limit);
      logger.info(`Retrieved ${count} machines`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.OK,
            "machinesRetrieved",
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
   * /api/v1/machines/{id}:
   *   get:
   *     summary: Get a machine by ID
   *     tags: [Machine]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine to retrieve details for.
   *     responses:
   *       200:
   *         description: Detailed information about the machine, including associated NFC tag data.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Machine'
   *       404:
   *         description: Machine not found.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
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
        throw new HTTP404Error("machineNotFound");
      }
      logger.info(`Retrieved machine: ${machine.name}`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(req, HttpStatusCode.OK, "machineRetrieved", machine)
        );
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
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the machine to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - machineCategoryId
   *               - nfcTagId
   *               - studioId
   *             properties:
   *               name:
   *                 type: string
   *                 description: New name of the machine.
   *               machineCategoryId:
   *                 type: integer
   *                 description: Updated category ID of the machine.
   *               nfcTagId:
   *                 type: integer
   *                 description: Updated NFC tag ID associated with the machine.
   *               studioId:
   *                 type: integer
   *                 description: Updated studio ID where the machine is located.
   *     responses:
   *       200:
   *         description: Machine updated successfully.
   *       400:
   *         description: Bad request, such as missing or invalid fields in the request.
   *       404:
   *         description: Machine not found.
   */
  static async updateMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, machineCategoryId, nfcTagId, studioId } = req.body;

      let machine = await Machine.findByPk(id);
      if (!machine) {
        throw new HTTP404Error("machineNotFound");
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
          return res
            .status(HttpStatusCode.OK)
            .json(
              new DataResponse(
                req,
                HttpStatusCode.OK,
                "machineUpdated",
                machine
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
   *       500:
   *         description: Server error.
   */
  static async deleteMachine(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const machine = await Machine.findByPk(id);
      if (!machine) {
        throw new HTTP404Error("machineNotFound");
      }
      await machine.destroy();
      logger.info(`Deleted machine: ${machine.name}`);
      return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export default MachineController;
