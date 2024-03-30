import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../util/database";
import MachineCategory from "./MachineCategory";
import Unit from "./Unit";
import Session from "./Session";
import User from "./User";

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainingEntry:
 *       type: object
 *       required:
 *         - value
 *         - unitId
 *         - machineCategoryId
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
 *         machineCategoryId:
 *           type: number
 *           description: The id of the category the Training Entry belongs to
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
  declare machineCategoryId: ForeignKey<MachineCategory["id"]>;
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
    machineCategoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: MachineCategory,
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
    tableName: "training_entries",
    timestamps: true,
    sequelize,
  }
);

export default TrainingEntry;
