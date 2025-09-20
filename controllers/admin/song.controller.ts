import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/config";

//[GET]/songs/
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false,
  });
  const songsWithSinger = [];

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      status: "active",
      deleted: false,
    }).select("fullName");

    songsWithSinger.push({
      ...song.toObject(),
      infoSinger,
    });
  }
  res.render("admin/pages/songs/index", {
    title: "Song",
    songs: songsWithSinger,
  });
};
//[GET]/admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;
  const songs = await Song.findOne({
    _id: id,
    deleted: false,
  });
  const topics = await Topic.find({
    deleted: false,
  }).select("title");

  const singers = await Singer.find({
    deleted: false,
  }).select("fullName");
  res.render("admin/pages/songs/edit", {
    title: "Edit Songs",
    songs,
    topics,
    singers,
  });
};
//[GET]/admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    status: "active",
    deleted: false,
  }).select("title");

  const singers = await Singer.find({
    status: "active",
    deleted: false,
  }).select("fullName");
  res.render("admin/pages/songs/create", {
    title: "Create Songs",
    topics,
    singers,
  });
};
//[POST]/admin/songs/create
export const createPost = async (req: Request, res: Response) => {
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
  const songs = new Song(dataSong);
  await songs.save();

  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};
// [PATCH]/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
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
  await Song.updateOne(
    {
      _id: id,
    },
    dataSong
  );

  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};
