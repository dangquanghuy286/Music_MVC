import { Express } from "express";
import { topicRoutes } from "./topic.route";
import { song } from "./song.route";
import { favoriteSong } from "./favoriteSong.route";

const clientRoutes = (app: Express): void => {
  app.use("/topics", topicRoutes);
  app.use("/songs", song);
  app.use("/favorite-song", favoriteSong);
};
export default clientRoutes;
