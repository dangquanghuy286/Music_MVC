import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";

//[GET]/songs
export const listSong = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    slug: req.params.slug,

    status: "active",
    deleted: false,
  });

  const songs = await Song.find({
    topicId: topic?._id,
    status: "active",
    deleted: false,
  }).select("avatar title slug singerId like");

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

  res.render("client/pages/songs/index", {
    title: "Bài hát",
    songs: songsWithSinger,
  });
};
