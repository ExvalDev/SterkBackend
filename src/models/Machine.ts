import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../utils/database";
import NFCTag from "./NFCTag";
import Studio from "./Studio";
import MachineCategory from "./MachineCategory";

/**
 * @swagger
 * components:
 *   schemas:
 *     Machine:
 *       type: object
 *       required:
 *         - name
 *         - machineCategoryId
 *         - nfcTagId
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the fixedcost
 *         name:
 *           type: string
 *           description: The name of the machine
 *         machineCategoryId:
 *           type: number
 *           description: The id of the category the machine belongs to
 *         nfcTagId:
 *           type: number
 *           description: The id of the NFC-Tag
 *         studioId:
 *           type: number
 *           description: The id of the studio
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The auto-generated creation date of the fixedcost
 *         updatedAt:
 *           type: string
 *           format: date
 *           description: The auto-generated last update of the fixedcost
 */
class Machine extends Model<
  InferAttributes<Machine>,
  InferCreationAttributes<Machine>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare machineCategoryId: ForeignKey<MachineCategory["id"]>;
  declare nfcTagId: ForeignKey<NFCTag["id"]>;
  declare studioId: ForeignKey<Studio["id"]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Machine.init(
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
    machineCategoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: MachineCategory,
        key: "id",
      },
      allowNull: false,
    },
    nfcTagId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: NFCTag,
        key: "id",
      },
      allowNull: false,
    },
    studioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Studio,
        key: "id",
      },
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    modelName: "Machine",
    tableName: "machines",
    timestamps: true,
    sequelize,
  }
);

export default Machine;
