// Models
import TrainingData from "@/models/TrainingData";
import Unit from "@/models/Unit";
import MachineCategory from "@/models/MachineCategory";
import Session from "@/models/Session";
import NFCTag from "@/models/NFCTag";
import Machine from "@/models/Machine";
import User from "@/models/User";
import Role from "@/models/Role";
import logger from "@/config/winston";

const options = {
  constraints: true,
  onDelete: "CASCADE",
};

export const createAssociations = () => {
  Unit.hasMany(TrainingData, {
    ...options,
    foreignKey: "unitId",
  });
  MachineCategory.hasMany(TrainingData, {
    ...options,
    foreignKey: "machineCategoryId",
  });
  Session.hasMany(TrainingData, {
    ...options,
    foreignKey: "sessionId",
  });
  MachineCategory.hasMany(Machine, {
    ...options,
    foreignKey: "machineCategoryId",
  });
  NFCTag.hasOne(Machine, {
    ...options,
    foreignKey: "nfcTagId",
  });
  Role.hasMany(User, {
    ...options,
    foreignKey: "roleId",
  });
  User.hasMany(Session, {
    ...options,
    foreignKey: "userId",
  });
  User.hasMany(TrainingData, {
    ...options,
    foreignKey: "userId",
  });

  TrainingData.belongsTo(Unit, { foreignKey: "unitId" });
  TrainingData.belongsTo(MachineCategory, { foreignKey: "machineCategoryId" });
  TrainingData.belongsTo(Session, { foreignKey: "sessionId" });
  TrainingData.belongsTo(User, { foreignKey: "userId" });
  Machine.belongsTo(MachineCategory, { foreignKey: "machineCategoryId" });
  Machine.belongsTo(NFCTag, { foreignKey: "nfcTagId" });
  User.belongsTo(Role, { foreignKey: "roleId" });
  Session.belongsTo(User, { foreignKey: "userId" });

  logger.info("Associations created successfully");
};
