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
 *     Session:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         sessionStart:
 *           type: string
 *           format: date
 *           description: The start of the session
 *         sessionEnd:
 *           type: string
 *           format: date
 *           description: The end of the session
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The creation date of the session
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Last update of the session
 */
class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare id: CreationOptional<number>;
  declare sessionStart: string;
  declare sessionEnd: string;
  declare userId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    sessionStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    sessionEnd: {
      type: DataTypes.DATE,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: User,
        key: "id",
      },
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Session",
    tableName: "sessions",
    timestamps: true,
    sequelize,
  }
);

export default Session;
