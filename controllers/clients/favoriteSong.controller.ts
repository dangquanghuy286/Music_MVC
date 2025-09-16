import { Request, Response } from "express";
import FavoriteSong from "../../models/favorite-song.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
// [GET]/favorite-song/
export const index = async (req: Request, res: Response) => {
  const favoriteSong = await FavoriteSong.find({
    // userId: "",
    deleted: false,
  });

  for (const item of favoriteSong) {
    const infoSong = await Song.findOne({
      _id: item.songId,
    });

    const infoSinger = await Singer.findOne({
      _id: infoSong?.singerId,
    });
    (item as any).infoSong = infoSong;
    (item as any).infoSinger = infoSinger;
  }

  res.render("client/pages/favoriteSong/index", {
    title: "Favorite Songs",
    favoriteSong,
  });
};
