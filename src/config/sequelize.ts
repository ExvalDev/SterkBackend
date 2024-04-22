import { Sequelize, Dialect } from "sequelize";
import * as dotenv from "dotenv";
import logger from "@/config/winston";

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_DRIVER = process.env.DB_DRIVER as Dialect;
const DB_PASSWORD = process.env.DB_PASSWORD;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: DB_DRIVER,
  host: DB_HOST,
  logging: false,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection has been established successfully.");
  } catch (error) {
    console.log("Was ist los?", error);
    logger.error("Unable to connect to the database:", error);
  }
};

testConnection();
