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
exports.listen = exports.favorite = exports.likeSong = exports.detailSong = exports.listSong = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
//[GET]/songs
const listSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topic = yield topic_model_1.default.findOne({
        slug: req.params.slug,
        status: "active",
        deleted: false,
    });
    const songs = yield song_model_1.default.find({
        topicId: topic === null || topic === void 0 ? void 0 : topic._id,
        status: "active",
        deleted: false,
    }).select("avatar title slug singerId like");
    const songsWithSinger = [];
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select("fullName");
        songsWithSinger.push(Object.assign(Object.assign({}, song.toObject()), { infoSinger }));
    }
    res.render("client/pages/songs/index", {
        title: "Bài hát",
        songs: songsWithSinger,
    });
});
exports.listSong = listSong;
// [GET]/songs/detail/:slug
const detailSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugSong = req.params.slug;
        const song = yield song_model_1.default.findOne({ slug: slugSong });
        if (!song) {
            return res.redirect("/topics");
        }
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false,
        }).select("fullName");
        const topicName = yield topic_model_1.default.findOne({ _id: song.topicId }).select("description slug");
        const favoriteSong = yield favorite_song_model_1.default.findOne({
            songId: song.id,
        });
        res.render("client/pages/songs/detail", {
            title: song.title,
            song: song,
            infoSinger: infoSinger,
            topicName: topicName,
        });
    }
    catch (error) {
        console.log(error);
        res.redirect("/topics");
    }
});
exports.detailSong = detailSong;
// [PATCH]/songs/like/yes/:idSong
const likeSong = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idSong = req.params.idSong;
    const typeLike = req.params.typeLike;
    const song = yield song_model_1.default.findOne({
        _id: idSong,
        status: "active",
        deleted: false,
    });
    if (!song) {
        return res.status(404).json({
            code: 404,
            message: "Không tìm thấy bài hát",
        });
    }
    const newLike = typeLike == "like" ? (song.like || 0) + 1 : (song.like || 0) - 1;
    yield song_model_1.default.updateOne({
        _id: idSong,
    }, {
        like: newLike,
    });
    res.json({
        code: 200,
        message: "Thành công",
        like: newLike,
    });
});
exports.likeSong = likeSong;
// [PATCH]/songs/favorite/:typeFavorite/:idSong
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        const typeFavorite = req.params.typeFavorite;
        switch (typeFavorite) {
            case "favorite":
                const exitFavorite = yield favorite_song_model_1.default.findOne({
                    songId: idSong,
                });
                if (!exitFavorite) {
                    const record = new favorite_song_model_1.default({
                        // userId: "", // Thêm userId nếu cần thiết
                        songId: idSong,
                    });
                    yield record.save();
                }
                break;
            case "unfavorite":
                yield favorite_song_model_1.default.deleteOne({
                    songId: idSong,
                });
                break;
            default:
                return res.status(400).json({
                    code: 400,
                    message: "Invalid favorite type",
                });
        }
        // Trả về response thành công
        res.json({
            code: 200,
            message: "Success",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            code: 500,
            message: "Server error",
        });
    }
});
exports.favorite = favorite;
// [PATCH]/songs/listen/:idSong
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idSong = req.params.idSong;
        // Tìm bài hát và kiểm tra null
        const song = yield song_model_1.default.findOne({
            _id: idSong,
        });
        if (!song) {
            return res.json({
                code: 404,
                message: "Không tìm thấy bài hát!",
            });
        }
        const listen = song.listen + 1;
        // Update listen count
        yield song_model_1.default.updateOne({
            _id: idSong,
        }, {
            listen: listen,
        });
        const songNew = yield song_model_1.default.findOne({
            _id: idSong,
        });
        if (!songNew) {
            return res.json({
                code: 500,
                message: "Lỗi khi cập nhật!",
            });
        }
        res.json({
            code: 200,
            message: "Thành công!",
            listen: songNew.listen,
        });
    }
    catch (error) {
        console.error("Listen error:", error);
        res.json({
            code: 500,
            message: "Lỗi server!",
        });
    }
});
exports.listen = listen;
//# sourceMappingURL=song.controller.js.map