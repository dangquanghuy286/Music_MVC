import { Router } from "express";

import * as controller from "../../controllers/clients/song.controller";

const router: Router = Router();

router.get("/list/:slug", controller.listSong);
router.get("/detail/:slug", controller.detailSong);

export const song: Router = router;
