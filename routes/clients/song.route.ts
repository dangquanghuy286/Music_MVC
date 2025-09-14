import { Router } from "express";

import * as controller from "../../controllers/clients/song.controller";

const router: Router = Router();

router.get("/:slug", controller.listSong);

export const song: Router = router;
