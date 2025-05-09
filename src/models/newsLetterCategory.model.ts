import mongoose from "mongoose";
const { Schema } = mongoose;

const newsLetterCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "No description provided.",
    },
    newsLetterOwnerId: {
      type: String,
      required: true, // Owner of this category (same as campaign)
    },
  },
  { timestamps: true }
);

const NewsLetterCategory =
  mongoose.models.NewsLetterCategory ||
  mongoose.model("NewsLetterCategory", newsLetterCategorySchema);

export default NewsLetterCategory;
