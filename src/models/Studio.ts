import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import Licence from "./Licence";

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
 *         street:
 *           type: string
 *           description: The street name of the studio address
 *         houseNumber:
 *           type: string
 *           description: The house number of the studio address
 *         city:
 *           type: string
 *           description: The city of the studio address
 *         zip:
 *           type: string
 *           description: The ZIP code of the studio address
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
  declare street: string;
  declare houseNumber: string;
  declare city: string;
  declare zip: string;
  declare licenceId: ForeignKey<Licence["id"]>;
  declare Licence?: Licence;
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
    street: {
      type: DataTypes.STRING,
    },
    houseNumber: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    licenceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Licence,
        key: "id",
      },
      allowNull: false,
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
