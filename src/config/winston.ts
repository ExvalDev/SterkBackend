import winston from "winston";
import "winston-daily-rotate-file";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";

// Format for console logs: colorized
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({
    format: "YYYY-MM-DD hh:mm:ss A",
  }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.description || info.message}`
  )
);

// Format for file logs: no color
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD hh:mm:ss A",
  }),
  winston.format.printf(
    (info) =>
      `${info.timestamp} ${info.level}: ${info.description || info.message}`
  )
);

const logger = winston.createLogger({
  level: LOG_LEVEL,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.DailyRotateFile({
      filename: "%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      dirname: "logs",
      format: fileFormat,
    }),
  ],
});

export default logger;
