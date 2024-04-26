import { Request, Response, NextFunction } from "express";
import NFCTag from "@/models/NFCTag"; // Adjust the path as necessary
import { HTTP400Error, HTTP404Error } from "@/utils/error"; // Adjust the path as necessary
import logger from "@/config/winston";
import Studio from "@/models/Studio";
import Licence from "@/models/Licence";
import { HttpStatusCode } from "@/types/HttpStatusCode";
import User from "@/models/User";
import { Op } from "sequelize";

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
      // Fetch the studio and include the associated License
      const studio = await Studio.findOne({
        where: { id: studioId },
        include: [{ model: Licence }],
      });

      if (!studio) {
        throw new HTTP400Error("studioNotFound");
      }
      if (!studio.Licence) {
        throw new HTTP400Error("licenceNotFound");
      }

      // Count NFC tags already created for the studio
      const countNfcTags = await NFCTag.count({
        where: { studioId: studio.id },
      });

      if (countNfcTags >= studio.Licence.maxMachines) {
        throw new HTTP400Error("maxMachinesReached");
      }

      // Create the NFC tag
      await NFCTag.create({ nfcId, studioId })
        .then((nfcTag) => {
          logger.info(`NFC tag created: ${nfcTag.nfcId}`);
          return res.status(HttpStatusCode.CREATED).json(nfcTag);
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
   * /api/v1/nfctags:
   *   get:
   *     summary: Get all NFC tags
   *     tags: [NFCTag]
   *     responses:
   *       200:
   *         description: A list of NFC tags
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/NFCTag'
   */
  static async getAllNFCTags(req: Request, res: Response, next: NextFunction) {
    try {
      const nfctags = await NFCTag.findAll();
      logger.info(`Retrieved ${nfctags.length} NFC tags`);
      return res.status(HttpStatusCode.OK).json(nfctags);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/nfctags/studios:
   *   get:
   *     summary: Get all NFC tags by studios
   *     tags: [NFCTag]
   *     responses:
   *       200:
   *         description: A list of NFC tags associated with the studios the user is responsible for.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/NFCTag'
   */
  static async getAllNFCTagsByStudio(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.body.user.id;
      await User.findByPk(userId, {
        include: [{ model: Studio }],
      }).then(async (user) => {
        const studioIds = user.Studios.map((studio) => studio.id);
        await NFCTag.findAll({
          where: {
            studioId: {
              [Op.or]: studioIds,
            },
          },
        }).then((nfcTags) => {
          return res.status(HttpStatusCode.OK).json(nfcTags);
        });
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/nfctags/{id}:
   *   get:
   *     summary: Get a NFC tag by ID
   *     tags: [NFCTag]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: ID of the NFC tag to get
   *     responses:
   *       200:
   *         description: NFC tag details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NFCTag'
   *       404:
   *         description: NFC tag not found
   */
  static async getNFCTagById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const nfctag = await NFCTag.findByPk(id);
      if (!nfctag) {
        throw new HTTP404Error("nfcTagNotFound");
      }
      logger.info(`Retrieved NFC tag: ${nfctag.nfcId}`);
      return res.status(HttpStatusCode.OK).json(nfctag);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/nfctags/{id}:
   *   put:
   *     summary: Update a NFC tag
   *     tags: [NFCTag]
   *     parameters:
   *      - in: path
   *        name: id
   *        required: true
   *        schema:
   *          type: integer
   *        description: ID of the NFC tag to update
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
   *       200:
   *         description: NFC tag updated successfully
   *       404:
   *         description: NFC tag not found
   */
  static async updateNFCTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nfcId } = req.body;
      const nfctag = await NFCTag.findByPk(id);
      if (!nfctag) {
        throw new HTTP404Error("nfcTagNotFound");
      }
      nfctag.nfcId = nfcId;
      await nfctag
        .save()
        .then((nfcTag) => {
          logger.info(`Updated NFC tag: ${nfctag.nfcId}`);
          return res.json(nfctag);
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
   *        schema:
   *          type: integer
   *        required: true
   *        description: The id of the NFC-Tag to delete
   *     responses:
   *       200:
   *         description: Deleted NFC-Tag.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/NFCTag'
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
      return res.status(HttpStatusCode.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

export default NFCTagController;
