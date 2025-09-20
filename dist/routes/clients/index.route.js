"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const favoriteSong_route_1 = require("./favoriteSong.route");
const search_route_1 = require("./search.route");
const clientRoutes = (app) => {
    app.use("/topics", topic_route_1.topicRoutes);
    app.use("/songs", song_route_1.song);
    app.use("/favorite-song", favoriteSong_route_1.favoriteSong);
    app.use("/search", search_route_1.searchRoutes);
};
exports.default = clientRoutes;
//# sourceMappingURL=index.route.js.map