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
exports.editPatch = exports.createPost = exports.create = exports.edit = exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const config_1 = require("../../config/config");
//[GET]/songs/
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield song_model_1.default.find({
        deleted: false,
    });
    const songsWithSinger = [];
    for (const song of songs) {
        const infoSinger = yield singer_model_1.default.findOne({
            _id: song.singerId,
            status: "active",
            deleted: false,
        }).select("fullName");
        songsWithSinger.push(Object.assign(Object.assign({}, song.toObject()), { infoSinger }));
    }
    res.render("admin/pages/songs/index", {
        title: "Song",
        songs: songsWithSinger,
    });
});
exports.index = index;
//[GET]/admin/songs/edit/:id
const edit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const songs = yield song_model_1.default.findOne({
        _id: id,
        deleted: false,
    });
    const topics = yield topic_model_1.default.find({
        deleted: false,
    }).select("title");
    const singers = yield singer_model_1.default.find({
        deleted: false,
    }).select("fullName");
    res.render("admin/pages/songs/edit", {
        title: "Edit Songs",
        songs,
        topics,
        singers,
    });
});
exports.edit = edit;
//[GET]/admin/songs/create
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield topic_model_1.default.find({
        status: "active",
        deleted: false,
    }).select("title");
    const singers = yield singer_model_1.default.find({
        status: "active",
        deleted: false,
    }).select("fullName");
    res.render("admin/pages/songs/create", {
        title: "Create Songs",
        topics,
        singers,
    });
});
exports.create = create;
//[POST]/admin/songs/create
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let avatar = "";
    let audio = "";
    if (req.body.avatar) {
        avatar = req.body.avatar[0];
    }
    if (req.body.audio) {
        audio = req.body.audio[0];
    }
    const dataSong = {
        title: req.body.title,
        singerId: req.body.singerId,
        topicId: req.body.topicId,
        description: req.body.description,
        status: req.body.status,
        lyrics: req.body.lyrics,
        avatar: avatar,
        audio: audio,
    };
    const songs = new song_model_1.default(dataSong);
    yield songs.save();
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
});
exports.createPost = createPost;
// [PATCH]/songs/edit/:id
const editPatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const dataSong = {
        title: req.body.title,
        singerId: req.body.singerId,
        topicId: req.body.topicId,
        description: req.body.description,
        status: req.body.status,
        lyrics: req.body.lyrics,
    };
    if (req.body.avatar) {
        dataSong["avatar"] = req.body.avatar[0];
    }
    if (req.body.audio) {
        dataSong["audio"] = req.body.audio[0];
    }
    yield song_model_1.default.updateOne({
        _id: id,
    }, dataSong);
    res.redirect(`/${config_1.systemConfig.prefixAdmin}/songs`);
});
exports.editPatch = editPatch;
//# sourceMappingURL=song.controller.js.map