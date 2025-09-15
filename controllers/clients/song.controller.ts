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
// [GET]/songs/detail/:slug
export const detailSong = async (req: Request, res: Response) => {
  try {
    const slugSong = req.params.slug;
    const song = await Song.findOne({ slug: slugSong });
    if (!song) {
      return res.redirect("/topics");
    }

    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    }).select("fullName");

    const topicName = await Topic.findOne({ _id: song.topicId }).select(
      "description slug"
    );
    res.render("client/pages/songs/detail", {
      title: song.title,
      song: song,
      infoSinger: infoSinger,
      topicName: topicName,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/topics");
  }
};
// [PATCH]/songs/like/yes/:idSong
export const likeSong = async (req: Request, res: Response) => {
  const idSong = req.params.idSong;
  const typeLike = req.params.typeLike;

  const song = await Song.findOne({
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
  const newLike: number =
    typeLike == "like" ? (song.like || 0) + 1 : (song.like || 0) - 1;
  await Song.updateOne(
    {
      _id: idSong,
    },
    {
      like: newLike,
    }
  );

  res.json({
    code: 200,
    message: "Thành công",
    like: newLike,
  });
};
