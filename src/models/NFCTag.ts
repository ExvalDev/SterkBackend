import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../config/sequelize";
import Studio from "./Studio";

/**
 * @swagger
 * components:
 *   schemas:
 *     NFCTag:
 *       type: object
 *       required:
 *         - nfcId
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the category
 *         nfcId:
 *           type: string
 *           description: The NFCId of the NFC-Tag
 *         studioId:
 *           type: number
 *           description: The id of the studio
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the safing
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the safing
 */
class NFCTag extends Model<
  InferAttributes<NFCTag>,
  InferCreationAttributes<NFCTag>
> {
  declare id: CreationOptional<number>;
  declare nfcId: string;
  declare studioId: ForeignKey<Studio["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

NFCTag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nfcId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "NFCTag",
    tableName: "nfcTags",
    timestamps: true,
    sequelize,
  }
);

export default NFCTag;
