import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/search.controller";

router.get("/result", controller.search);

export const searchRoutes: Router = router;
