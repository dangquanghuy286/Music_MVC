import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";

import clientRoutes from "./routes/clients/index.route";

dotenv.config();
database.connectDB();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "pug");

// Client routes
clientRoutes(app);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
