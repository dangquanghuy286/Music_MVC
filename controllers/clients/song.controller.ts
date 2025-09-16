import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

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
    const favoriteSong = await FavoriteSong.findOne({
      songId: song.id,
    });

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
// [PATCH]/songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  try {
    const idSong = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite":
        const exitFavorite = await FavoriteSong.findOne({
          songId: idSong,
        });
        if (!exitFavorite) {
          const record = new FavoriteSong({
            // userId: "", // Thêm userId nếu cần thiết
            songId: idSong,
          });
          await record.save();
        }
        break;
      case "unfavorite":
        await FavoriteSong.deleteOne({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: "Server error",
    });
  }
};
// [PATCH]/songs/listen/:idSong
export const listen = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;

    // Tìm bài hát và kiểm tra null
    const song = await Song.findOne({
      _id: idSong,
    });

    if (!song) {
      return res.json({
        code: 404,
        message: "Không tìm thấy bài hát!",
      });
    }

    const listen: number = song.listen + 1;

    // Update listen count
    await Song.updateOne(
      {
        _id: idSong,
      },
      {
        listen: listen,
      }
    );

    const songNew = await Song.findOne({
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
  } catch (error) {
    console.error("Listen error:", error);
    res.json({
      code: 500,
      message: "Lỗi server!",
    });
  }
};
