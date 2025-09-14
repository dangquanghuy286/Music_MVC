import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { song } from "./song.route";

const clientRoutes = (app: Express): void => {
  app.use("/topics", topicRoutes);
  app.use("/songs", song);
};
export default clientRoutes;
