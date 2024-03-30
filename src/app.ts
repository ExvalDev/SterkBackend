import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { createRoutes } from "./routes/routes";

// Sequelize
import { sequelize } from "@/util/database";
import { createAssociations } from "@/util/associations";
import seedData from "@/util/seed";

// CORS
import cors from "cors";
import logger from "./config/winston";
import { corsOptions } from "./config/cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(cors(corsOptions));

// ROUTES
createRoutes(app);

// SEQUELIZE ASSOCIATIONS
createAssociations();

sequelize
  .sync({ force: false })
  .then(async () => {
    await seedData();
    app.listen(port);
    logger.warn(`Server running on port ${port}`);
  })
  .catch((error) => logger.error(error.message));
