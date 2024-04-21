import { Sequelize, Dialect } from "sequelize";
import * as dotenv from "dotenv";
import logger from "@/config/winston";

dotenv.config();

const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  dialect: dbDriver,
  host: dbHost,
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
};

testConnection();
