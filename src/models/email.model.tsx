import mongoose from "mongoose";

const { Schema } = mongoose;

// const emailSchema = new Schema(
//   {
//     title: {
//       type: String,
//     },
//     content: {
//       type: String,
//     },
//     newsLetterOwnerId: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

const emailSchema = new Schema(
  {
    title: String,
    content: String,
    newsLetterOwnerId: String,

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


const Email = mongoose.models.Emails || mongoose.model("Emails", emailSchema);
export default Email;
