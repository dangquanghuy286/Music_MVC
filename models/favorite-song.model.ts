import mongoose from "mongoose";

const favoriteSongSchema = new mongoose.Schema(
  {
    userId: { type: String },
    songId: { type: String },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const FavoriteSong = mongoose.model(
  "FavoriteSong",
  favoriteSongSchema,
  "favorite_songs"
);

export default FavoriteSong;
