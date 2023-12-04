import mongoose, { Schema } from "mongoose";

const ArticleSchema = new Schema(
  {
    url: {
      type: String,
      unique: true,
    },
    title: { type: String },
    summary: { type: String },
  },
  { timestamps: true }
);

const Article =
  mongoose.models.Article || mongoose.model("Article", ArticleSchema);

export default Article;
