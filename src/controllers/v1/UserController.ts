import { Request, Response, NextFunction } from "express";
import User from "@/models/User"; // Adjust the path as necessary
import { HTTP404Error, HTTP400Error, HTTP409Error } from "@/utils/error"; // Adjust the path as necessary
import bcrypt from "bcrypt";
import logger from "@/config/winston";
import Studio from "@/models/Studio";
import { HttpStatusCode } from "@/types/enums/HttpStatusCode";

class UserController {
  /**
   * @swagger
   * tags:
   *   name: User
   *   description: API for User
   * /api/v1/users:
   *   post:
   *     summary: Create a new user
   *     tags: [User]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *              - name
   *              - roleId
   *            properties:
   *              name:
   *                type: string
   *              email:
   *                type: string
   *                format: email
   *                description: The email of the user
   *              password:
   *                type: string
   *                format: password
   *                description: The password of the user
   *              language:
   *                type: string
   *                description: The language of the user
   *              roleId:
   *                type: number
   *                description: The role ID of the user
   *              studioId:
   *                type: number
   *                descriptio: The studio ID of the user
   *     responses:
   *       201:
   *         description: User created successfully.
   *       400:
   *         description: Bad request.
   */
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password, language, roleId, studioId } = req.body;

      // Check if user already exists
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        throw new HTTP409Error("emailAlreadyInUse");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        name,
        email,
        password: hashedPassword,
        language,
        roleId,
      })
        .then(async (user) => {
          logger.info(`User created: ${user.email}`);
          await Studio.findByPk(studioId)
            .then(async (studio) => {
              if (!studio) {
                logger.error("Studio not found");
              } else {
                // @ts-ignore
                await user.addStudio(studio);
              }
            })
            .catch((error) => {
              logger.error(error.message);
            });
          const { password: _, ...userWithoutPassword } = user.toJSON();
          return res.status(HttpStatusCode.CREATED).json(userWithoutPassword);
        })
        .catch((error) => {
          throw new HTTP400Error("BAD REQUEST", error);
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users:
   *   get:
   *     summary: Get all users
   *     tags: [User]
   *     responses:
   *       200:
   *         description: A list of users.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, // Exclude password from results
      });
      logger.info(`Retrieved ${users.length} users`);
      return res.json(users);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the user to get
   *     responses:
   *       200:
   *         description: User details.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found.
   */
  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw new HTTP404Error("userNotFound");
      }
      logger.info(`Retrieved user: ${user.email}`);
      const { password: _, ...userWithoutPassword } = user.toJSON();
      return res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   put:
   *     summary: Update a user
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the user to update
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *            type: object
   *            required:
   *              - email
   *              - password
   *              - name
   *              - roleId
   *            properties:
   *              name:
   *                type: string
   *              email:
   *                type: string
   *                format: email
   *                description: The email of the user
   *              password:
   *                type: string
   *                format: password
   *                description: The password of the user
   *              language:
   *                type: string
   *                description: The language of the user
   *              roleId:
   *                type: number
   *                description: The role ID of the user
   *     responses:
   *       200:
   *         description: User updated successfully.
   *       404:
   *         description: User not found.
   */
  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, email, language, roleId } = req.body;

      let user = await User.findByPk(id);
      if (!user) {
        throw new HTTP404Error("userNotFound");
      }

      return await user
        .update({ name, email, language, roleId })
        .then((user) => {
          logger.info(`Updated user: ${user.email}`);
          const { password: _, ...userWithoutPassword } = user.toJSON();
          return res.status(201).json(userWithoutPassword);
        })
        .catch((error) => {
          throw new HTTP400Error("BAD REQUEST", error);
        });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/v1/users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [User]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the user to delete
   *     responses:
   *       204:
   *         description: User deleted successfully.
   *       404:
   *         description: User not found.
   */
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw new HTTP404Error("userNotFound");
      }

      await user.destroy();
      logger.info(`User deleted: ${id}`);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
