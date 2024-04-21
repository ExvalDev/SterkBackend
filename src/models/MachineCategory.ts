import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "../utils/database";

/**
 * @swagger
 * components:
 *   schemas:
 *     MachineCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the income
 *         name:
 *           type: string
 *           description: The name of the machine category
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the income
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the income
 *         userId:
 *           type: number
 *           description: The id of the user
 */
class MachineCategory extends Model<
  InferAttributes<MachineCategory>,
  InferCreationAttributes<MachineCategory>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MachineCategory.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "MachineCategory",
    tableName: "machineCategories",
    timestamps: true,
    sequelize,
  }
);

export default MachineCategory;
