import express, { Express } from "express";
import bodyParser from "body-parser";

// CUSTOM
import { createRoutes } from "./routes/routes";
import ErrorHandler from "./middleware/ErrorHandler";
import { corsOptions } from "./config/cors";

// SWAGGER
import swaggerUi from "swagger-ui-express";
import { config } from "./config/swagger";

// DOTENV
import dotenv from "dotenv";

// SEQUELIZE
import { sequelize } from "./util/database";
import { createAssociations } from "./util/associations";

// CORS
import cors from "cors";

// WINSTON
import logger from "./config/winston";

// PASSPORT
import "@/config/passport";
import passport from "passport";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(config));

// CORS
app.use(cors(corsOptions));

// STATIC
app.use("/static", express.static("./public"));

// PASSPORT
app.use(passport.initialize());

// ROUTES
createRoutes(app);

// ERROR HANDLER
app.use(ErrorHandler);

// SEQUELIZE
createAssociations();
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(port);
    logger.warn(`Server running on port ${port}`);
  })
  .catch((error) => logger.info(error));
