import { Request, Response, NextFunction } from "express";
import NFCTag from "@/models/NFCTag"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import Studio from "@/models/Studio";
import Licence from "@/models/Licence";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";
import User from "@/models/User";
import { Op } from "sequelize";
import DataResponse from "@/types/classes/DataResponse";
import PaginationResponse from "@/types/classes/PaginationResponse";
import { parseFilterString } from "@/utils/helpers";
import checkPermission from "@/middleware/CheckPermission";

class NFCTagController {
  /**
   * @swagger
   * tags:
   *   name: NFCTag
   *   description: API for NFC-Tags
   * /api/v1/nfctags:
   *   post:
   *     summary: Create a new NFC tag
   *     tags: [NFCTag]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - nfcId
   *              - studioId
   *            properties:
   *              nfcId:
   *                type: string
   *              studioId:
   *                type: integer
   *     responses:
   *       201:
   *         description: NFC tag created successfully
   *       400:
   *         description: Bad request
   */
  static async createNFCTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { nfcId, studioId } = req.body;
      const studio = await Studio.findOne({
        where: { id: studioId },
        include: [Licence],
      });

      if (!studio || !studio.Licence) {
        throw new HTTP400Error(studio ? "licenceNotFound" : "studioNotFound");
      }

      const countNfcTags = await NFCTag.count({ where: { studioId } });
      if (countNfcTags >= studio.Licence.maxMachines) {
        throw new HTTP400Error("maxMachinesReached");
      }

      const nfcTag = await NFCTag.create({ nfcId, studioId });
      logger.info(`NFC tag created: ${nfcTag.nfcId}`);
      res
        .status(HttpStatusCode.CREATED)
        .json(
          new DataResponse(req, HttpStatusCode.CREATED, "nfcTagCreated", nfcTag)
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/nfctags:
   *   get:
   *     summary: Retrieve a list of NFC tags with optional filtering and pagination
   *     tags: [NFCTag]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Number of records per page for pagination
   *       - in: query
   *         name: filter
   *         schema:
   *           type: string
   *         description: JSON string of filter conditions
   *     responses:
   *       200:
   *         description: A list of NFC tags along with pagination details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "NFC tags retrieved successfully"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/NFCTag'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationResponse'
   *       400:
   *         description: Invalid JSON format in filter parameter or other bad request error
   *       401:
   *         description: Unauthorized access if the user does not have permission to view the data
   */
  static async getNFCTags(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      const filterString = req.query.filter as string;
      const filters = parseFilterString(filterString);
      await checkPermission(req, filters.studioId);
      const { count, rows } = await NFCTag.findAndCountAll({
        limit,
        offset,
        where: filters,
      });
      const totalPages = Math.ceil(count / limit);
      logger.info(`Retrieved ${rows.length} NFC tags`);
      res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(
            req,
            HttpStatusCode.OK,
            "NFC tags retrieved successfully",
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
   * /api/v1/nfctags/{id}:
   *   get:
   *     summary: Retrieve details of a specific NFC tag by its ID
   *     tags: [NFCTag]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the NFC tag to retrieve
   *     responses:
   *       200:
   *         description: Detailed information about the NFC tag
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "NFC tag retrieved successfully"
   *                 data:
   *                   $ref: '#/components/schemas/NFCTag'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     totalPages:
   *                       type: integer
   *                       example: 1
   *                     totalItems:
   *                       type: integer
   *                       example: 1
   *       404:
   *         description: NFC tag not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "NFC tag not found"
   */
  static async getNFCTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const nfctag = await NFCTag.findByPk(id);
      if (!nfctag) {
        throw new HTTP404Error("nfcTagNotFound");
      }
      logger.info(`Retrieved NFC tag: ${nfctag.nfcId}`);
      return res
        .status(HttpStatusCode.OK)
        .json(
          new DataResponse(req, HttpStatusCode.OK, "nfcTagRetrieved", nfctag)
        );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/nfctags/{id}:
   *   put:
   *     summary: Update a specific NFC tag by its ID
   *     tags: [NFCTag]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The ID of the NFC tag to be updated
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nfcId
   *               - studioId
   *             properties:
   *               nfcId:
   *                 type: string
   *                 description: The new NFC identifier for the tag
   *               studioId:
   *                 type: integer
   *                 description: The ID of the studio associated with the NFC tag
   *     responses:
   *       200:
   *         description: NFC tag updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 200
   *                 message:
   *                   type: string
   *                   example: "NFC tag updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/NFCTag'
   *       404:
   *         description: NFC tag not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 httpCode:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: "NFC tag not found"
   *       400:
   *         description: Bad request (e.g., malformed request body)
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
   *                   example: "Bad request due to invalid input data"
   */
  static async updateNFCTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nfcId } = req.body;
      const nfctag = await NFCTag.findByPk(id);
      if (!nfctag) {
        throw new HTTP404Error("nfcTagNotFound");
      }
      await checkPermission(req, nfctag.studioId);
      nfctag.nfcId = nfcId;
      await nfctag
        .save()
        .then((nfcTag) => {
          logger.info(`Updated NFC tag: ${nfctag.nfcId}`);
          return res
            .status(HttpStatusCode.OK)
            .json(
              new DataResponse(req, HttpStatusCode.OK, "nfcTagUpdated", nfcTag)
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
   * /api/v1/nfctags/{id}:
   *   delete:
   *     summary: Delete a NFC-Tag by id
   *     tags: [NFCTag]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: The id of the NFC-Tag to delete
   *     responses:
   *       204:
   *         description: NFC-Tag deleted successfully.
   *       404:
   *         description: NFC-Tag not found
   */
  static async deleteNFCTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const nfctag = await NFCTag.findByPk(id);
      if (!nfctag) {
        throw new HTTP404Error("nfcTagNotFound");
      }
      await nfctag.destroy();
      logger.info(`Deleted NFC-Tag: ${nfctag.nfcId}`);
      res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export default NFCTagController;
