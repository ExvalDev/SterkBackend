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
 *     TrainingData:
 *       type: object
 *       required:
 *         - value
 *         - unitId
 *         - machineCategoryId
 *         - sessionId
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the trainingData
 *         value:
 *           type: number
 *           description: The description of your spending
 *         unitId:
 *           type: number
 *           description: The id of the unit
 *         machineCategoryId:
 *           type: number
 *           description: The id of the category the trainingData belongs to
 *         sessionId:
 *           type: number
 *           description: The id of the session the trainingData belongs to
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the spending
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the spending
 *         userId:
 *           type: number
 *           description: The id of the user
 *         categoryId:
 *           type: number
 *           description: The id of the category
 */
class TrainingData extends Model<
  InferAttributes<TrainingData>,
  InferCreationAttributes<TrainingData>
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

TrainingData.init(
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
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "TrainingData",
    tableName: "training_data",
    timestamps: true,
    sequelize,
  }
);

export default TrainingData;
