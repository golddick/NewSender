// import mongoose from "mongoose";
// const { Schema } = mongoose;

// const campaignSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     description: {
//       type: String,
//       default: "No description provided.",
//     },
//     newsLetterOwnerId: {
//       type: String,
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       default: Date.now,
//     },
//     endDate: {
//       type: Date,
//       required: false,
//     },
//     status: {
//       type: String,
//       enum: ["Active", "Inactive", "Completed"],
//       default: "Active",
//     },
//     emails: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Emails",
//       },
//     ],
//     category: {
//       type: Schema.Types.ObjectId,
//       ref: "NewsLetterCategory",
//       required: true, 
//     },
//   },
//   { timestamps: true }
// );

// const Campaign =
//   mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);

// export default Campaign;








import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

interface ICampaign {
  name: string;
  description: string;
  newsLetterOwnerId: string;
  startDate?: Date;
  endDate?: Date;
  status: "Active" | "Inactive" | "Completed";
  emails: Types.ObjectId[];
  subscriberIds: Types.ObjectId[];
  category: Types.ObjectId;
  subscribers?: number;
  emailsSent?: number;
}

const campaignSchema = new Schema<ICampaign>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "No description provided." },
    newsLetterOwnerId: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
      default: "Active",
    },
    emails: [{ type: Schema.Types.ObjectId, ref: "Email" }],
    category: { type: Schema.Types.ObjectId, ref: "NewsLetterCategory", required: true },
    subscriberIds: [{ type: Schema.Types.ObjectId, ref: "Subscribers" }],
    subscribers: { type: Number, default: 0 },
    emailsSent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Campaign = mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", campaignSchema);

export default Campaign;