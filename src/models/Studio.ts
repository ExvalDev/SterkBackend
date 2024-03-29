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
 *     Studio:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the studio
 *         name:
 *           type: string
 *           description: The name of the studio
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the studio
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the studio
 */
class Studio extends Model<
  InferAttributes<Studio>,
  InferCreationAttributes<Studio>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Studio.init(
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
    modelName: "Studio",
    tableName: "studios",
    timestamps: true,
    sequelize,
  }
);

export default Studio;
