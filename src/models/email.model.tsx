import mongoose from "mongoose";

const { Schema } = mongoose;

const emailSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    newsLetterOwnerId: {
      type: String,
      required: true,
    },
    campaign: {
      type: Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "NewsLetterCategory",
      required: true, // Ensures each email is linked to a category
    },
    isOpened: {
      type: Boolean,
      default: false,
    },
    openedAt: {
      type: Date,
    },
    isClicked: {
      type: Boolean,
      default: false,
    },
    clickedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

export default Email;
