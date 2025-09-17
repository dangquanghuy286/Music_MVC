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
  const dataSong = {
    title: req.body.title,
    singerId: req.body.singerId,
    topicId: req.body.topicId,
    description: req.body.description,
    status: req.body.status,
    avatar: req.body.avatar,
  };
  const songs = new Song(dataSong);
  await songs.save();

  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};
