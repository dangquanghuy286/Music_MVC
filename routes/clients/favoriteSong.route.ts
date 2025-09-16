import { Router } from "express";
const router: Router = Router();
import * as controller from "../../controllers/clients/favoriteSong.controller";
router.get("/", controller.index);
export const favoriteSong: Router = router;
