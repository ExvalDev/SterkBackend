import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import Unit from "./Unit";
import Session from "./Session";
import User from "./User";
import Machine from "./Machine";

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingEntry:
 *       type: object
 *       required:
 *         - value
 *         - unitId
 *         - machineId
 *         - sessionId
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the Training Entry
 *         value:
 *           type: number
 *           description: The description of your spending
 *         unitId:
 *           type: number
 *           description: The id of the unit
 *         machineId:
 *           type: number
 *           description: The id of the machine the Training Entry belongs to
 *         sessionId:
 *           type: number
 *           description: The id of the session the Training Entry belongs to
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the Training Entry
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the Training Entry
 *         userId:
 *           type: number
 *           description: The id of the user
 *         categoryId:
 *           type: number
 *           description: The id of the category
 */
class TrainingEntry extends Model<
  InferAttributes<TrainingEntry>,
  InferCreationAttributes<TrainingEntry>
> {
  declare id: CreationOptional<number>;
  declare value: string;
  declare unitId: ForeignKey<Unit["id"]>;
  declare machineId: ForeignKey<Machine["id"]>;
  declare sessionId: ForeignKey<Session["id"]>;
  declare userId: ForeignKey<User["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

TrainingEntry.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    unitId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Unit,
        key: "id",
      },
      allowNull: false,
    },
    machineId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Machine,
        key: "id",
      },
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Session,
        key: "id",
      },
      allowNull: false,
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
    modelName: "TrainingEntry",
    tableName: "trainingEntries",
    timestamps: true,
    sequelize,
  }
);

export default TrainingEntry;
