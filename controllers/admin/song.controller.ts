import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

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
  console.log(songs);
};
