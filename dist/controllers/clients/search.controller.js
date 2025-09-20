"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const convertToSlug_1 = require("../../helpers/convertToSlug");
// [GET] /songs/search
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const type = req.params.typeSearch;
        const keyword = ((_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.toString()) || "";
        let newSongs = [];
        if (keyword) {
            const keywordRegex = new RegExp(keyword, "i");
            const stringSlug = (0, convertToSlug_1.convertToSlug)(keyword);
            const stringSlugRegex = new RegExp(stringSlug, "i");
            const songs = yield song_model_1.default.find({
                $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
            });
            for (const item of songs) {
                const infoUser = yield singer_model_1.default.findOne({
                    _id: item.singerId,
                });
                newSongs.push({
                    id: item.id,
                    title: item.title,
                    avatar: item.avatar,
                    like: item.like,
                    slug: item.slug,
                    infoUser: { fullName: (infoUser === null || infoUser === void 0 ? void 0 : infoUser.fullName) || "Unknown" },
                });
            }
        }
        switch (type) {
            case "result":
                res.render("client/pages/search/result", {
                    title: `Kết quả tìm kiếm: ${keyword}`,
                    songs: newSongs,
                    keyword,
                });
                break;
            case "suggest":
                res.json({
                    code: 200,
                    message: "Thành công!",
                    songs: newSongs,
                });
                break;
            default:
                break;
        }
    }
    catch (error) {
        console.error("Search error:", error);
        res.redirect("/");
    }
});
exports.search = search;
//# sourceMappingURL=search.controller.js.map