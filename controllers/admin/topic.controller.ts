import { Request, Response } from "express";
import Topic from "../../models/topic.model";

// [GET]/admin/topic
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  });
  res.render("admin/pages/topics/index", {
    title: "Topic",
    topics: topics,
  });
  console.log(topics);
};
