import swaggerJsdoc from "swagger-jsdoc";
import * as dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TrainTrack API",
      version: "1.0.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "EXVAL",
        url: "https://exval.de",
        email: "info@exval.de",
      },
    },
    servers: [
      {
        url: process.env.URL,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["**/*.ts"],
};

export const config = swaggerJsdoc(options);
