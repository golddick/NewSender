// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const emailSchema = new Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     newsLetterOwnerId: {
//       type: String,
//       required: true,
//     },
//     campaign: {
//       type: Schema.Types.ObjectId,
//       ref: "Campaign",
//       required: true,
//     },
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: "NewsLetterCategory",
//       required: true, // Ensures each email is linked to a category
//     },
//     isOpened: {
//       type: Boolean,
//       default: false,
//     },
//     openedAt: {
//       type: Date,
//     },
//     isClicked: {
//       type: Boolean,
//       default: false,
//     },
//     clickedAt: {
//       type: Date,
//     },
//   },
//   { timestamps: true }
// );

// const Email = mongoose.models.Email || mongoose.model("Email", emailSchema);

// export default Email;
 

// models/email.model.ts
import mongoose, { Schema } from "mongoose";

interface IEmail {
  title: string;
  content: string;
  newsLetterOwnerId: string;
  category?: mongoose.Types.ObjectId;
  campaign?: mongoose.Types.ObjectId;
  openCount: number;
  clickCount: number;
  clickedLinks: Array<{
    url: string;
    timestamp: Date;
  }>;
  lastOpened?: Date;
  lastClicked?: Date;
}

const emailSchema = new Schema<IEmail>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  newsLetterOwnerId: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: "NewsLetterCategory" },
  campaign: { type: Schema.Types.ObjectId, ref: "Campaign" },
  openCount: { type: Number, default: 0 },
  clickCount: { type: Number, default: 0 },
  clickedLinks: [{
    url: String,
    timestamp: { type: Date, default: Date.now }
  }],
  lastOpened: Date,
  lastClicked: Date
}, { timestamps: true });

const Email = mongoose.models.Email || mongoose.model<IEmail>("Email", emailSchema);

export default Email;