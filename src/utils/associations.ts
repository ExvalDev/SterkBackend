// Models
import TrainingEntry from "@/models/TrainingEntry";
import Unit from "@/models/Unit";
import MachineCategory from "@/models/MachineCategory";
import Session from "@/models/Session";
import NFCTag from "@/models/NFCTag";
import Machine from "@/models/Machine";
import User from "@/models/User";
import Role from "@/models/Role";
import Token from "@/models/Token";
import logger from "@/config/winston";
import Studio from "@/models/Studio";
import Licence from "@/models/Licence";

const options = {
  constraints: true,
  onDelete: "CASCADE",
};

export const createAssociations = () => {
  Unit.hasMany(TrainingEntry, {
    ...options,
    foreignKey: "unitId",
  });
  Machine.hasMany(TrainingEntry, {
    ...options,
    foreignKey: "machineId",
  });
  Session.hasMany(TrainingEntry, {
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
    as: "nfcTag",
  });
  Role.hasMany(User, {
    ...options,
    foreignKey: "roleId",
  });
  User.hasMany(Session, {
    ...options,
    foreignKey: "userId",
  });
  User.hasMany(TrainingEntry, {
    ...options,
    foreignKey: "userId",
  });
  User.hasMany(Token, {
    ...options,
    foreignKey: "userId",
  });
  Studio.hasMany(NFCTag, {
    ...options,
    foreignKey: "studioId",
  });
  Studio.hasMany(Machine, {
    ...options,
    foreignKey: "studioId",
  });
  Licence.hasMany(Studio, {
    ...options,
    foreignKey: "licenceId",
  });

  TrainingEntry.belongsTo(Unit, { foreignKey: "unitId" });
  TrainingEntry.belongsTo(Machine, { foreignKey: "machineId" });
  TrainingEntry.belongsTo(Session, { foreignKey: "sessionId" });
  TrainingEntry.belongsTo(User, { foreignKey: "userId" });
  Machine.belongsTo(MachineCategory, { foreignKey: "machineCategoryId" });
  Machine.belongsTo(NFCTag, { foreignKey: "nfcTagId", as: "nfcTag" });
  Machine.belongsTo(Studio, { foreignKey: "studioId" });
  User.belongsTo(Role, { foreignKey: "roleId" });
  Session.belongsTo(User, { foreignKey: "userId" });
  Token.belongsTo(User, { foreignKey: "userId" });
  NFCTag.belongsTo(Studio, { foreignKey: "studioId" });
  User.belongsToMany(Studio, {
    foreignKey: "userId",
    through: "user_studio",
  });
  Studio.belongsToMany(User, {
    foreignKey: "studioId",
    through: "user_studio",
  });
  Studio.belongsTo(Licence, { foreignKey: "licenceId" });

  logger.info("Associations created successfully");
};
