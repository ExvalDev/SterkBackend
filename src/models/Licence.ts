import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import { sequelize } from "../config/sequelize";

/**
 * @swagger
 * components:
 *   schemas:
 *     Licence:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the licence
 *         name:
 *           type: string
 *           description: The name of the role
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the licence
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the licence
 */
class Licence extends Model<
  InferAttributes<Licence>,
  InferCreationAttributes<Licence>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare maxMachines: number;
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Licence.init(
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
    maxMachines: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Licence",
    tableName: "licences",
    timestamps: true,
    sequelize,
  }
);

export default Licence;
