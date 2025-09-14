import { Request, Response, Router } from "express";
import Topic from "../../models/topic.model";
import * as topicController from "../../controllers/clients/topic.controller";
const router: Router = Router();

router.get("/", topicController.topics);
export const topicRoutes: Router = router;
