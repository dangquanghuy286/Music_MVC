import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /songs/search
export const search = async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword?.toString() || "";

    let newSongs: any[] = [];
    if (keyword) {
      const keywordRegex = new RegExp(keyword, "i");

      //   TẠO ra slugs không dấu ,thêm thêm dấu - ngăn cách
      const stringSlug = convertToSlug(keyword);
      const stringSlugRegex = new RegExp(stringSlug, "i");
      newSongs = await Song.find({
        $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
      });

      for (const item of newSongs) {
        const infoUser = await Singer.findOne({
          _id: item.singerId,
        });
        item["infoSinger"] = infoUser;
      }
    }

    res.render("client/pages/search/result", {
      title: `Kết quả tìm kiếm: ${keyword}`,
      songs: newSongs,
      keyword,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};
