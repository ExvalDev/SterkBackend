import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "../util/database";

/**
 * @swagger
 * components:
 *   schemas:
 *     Unit:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the unit
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The creation date of the spending
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: Last update of the spending
 */
class Unit extends Model<InferAttributes<Unit>, InferCreationAttributes<Unit>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Unit.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Unit",
    tableName: "units",
    timestamps: true,
    sequelize,
  }
);

export default Unit;
