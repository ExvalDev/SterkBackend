import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../utils/database";
import User from "./User";

/**
 * @swagger
 * components:
 *   schemas:
 *     Token:
 *       type: object
 *       required:
 *         - access_token
 *         - refresh_token
 *         - userId
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         access_token:
 *           type: string
 *           description: The access_token of the user
 *         refresh_token:
 *           type: string
 *           description: The refresh_token of the user
 *         sessionId:
 *          type: string
 *          description: The session id of the user
 *         userId:
 *           type: integer
 *           description: The id of the user
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The creation date of the user
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Last update of the user
 */
class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
  declare id: CreationOptional<number>;
  declare access_token: string;
  declare refresh_token: string;
  declare sessionId: string;
  declare userId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    access_token: {
      type: DataTypes.STRING,
    },
    refresh_token: {
      type: DataTypes.STRING,
    },
    sessionId: {
      type: DataTypes.STRING,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Token",
    tableName: "tokens",
    timestamps: true,
    sequelize,
  }
);

export default Token;
