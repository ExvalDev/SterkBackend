import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/swagger";

import { createRoutes } from "./routes/routes";

import ErrorHandler from "./middleware/ErrorHandler";

// Sequelize
import { sequelize } from "./util/database";
import { createAssociations } from "./util/associations";

// CORS
import cors from "cors";
import logger from "./config/winston";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config));

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// STATIC
app.use("/static", express.static("./public"));

// ROUTES
createRoutes(app);

// ERROR HANDLER
app.use(ErrorHandler);

// SEQUELIZE ASSOCIATIONS
createAssociations();

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(port);
    logger.warn(`Server running on port ${port}`);
  })
  .catch((error) => logger.info(error));
