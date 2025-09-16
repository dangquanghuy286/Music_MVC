import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /songs/search
export const search = async (req: Request, res: Response) => {
  try {
    const type = req.params.typeSearch;
    const keyword = req.query.keyword?.toString() || "";

    let newSongs: any[] = [];
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");
      const stringSlug = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");

      const songs = await Song.find({
        $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
      });

      for (const item of songs) {
        const infoUser = await Singer.findOne({
          _id: item.singerId,
        });

        newSongs.push({
          id: item.id,
          title: item.title,
          avatar: item.avatar,
          like: item.like,
          slug: item.slug,
          infoUser: { fullName: infoUser?.fullName || "Unknown" },
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
  } catch (error) {
    console.error("Search error:", error);
    res.redirect("/");
  }
};
