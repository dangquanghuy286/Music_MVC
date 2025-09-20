import express, { Express } from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import bodyParser from "body-parser";
import clientRoutes from "./routes/clients/index.route";
import adminRoutes from "./routes/admin/index.route";
import { systemConfig } from "./config/config";
import path from "path";
import methodOverride from "method-override";
dotenv.config();
database.connectDB();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// App locals
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// Client routes
clientRoutes(app);
// Admin routes
adminRoutes(app);

// Cấu hình middleware body-parser để parse dữ liệu từ form gửi lên (POST method)
app.use(bodyParser.urlencoded());

// Cấu hình TinyMce
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
