// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const subscriberShema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//     },
//     newsLetterOwnerId: {
//       type: String,
//     },
//     source: {
//       type: String,
//     },
//     status: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Subscriber =
//   mongoose.models.Subscribers || mongoose.model("Subscribers", subscriberShema);

// export default Subscriber;


import mongoose from "mongoose";

const { Schema } = mongoose;

const subscriberSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    newsLetterOwnerId: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "unknown",
    },
    status: {
      type: String,
      enum: ["Subscribed", "Unsubscribed", "Bounced"],
      default: "Subscribed",
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "NewsLetterCategory",
      required: true, // or set to `false` if optional
    },
    metadata: {
      campaign: { type: String },
      pageUrl: { type: String },
      formId: { type: String },
    },
  },
  { timestamps: true }
);


// Ensure unique email per owner
subscriberSchema.index({ email: 1, newsLetterOwnerId: 1 }, { unique: true });

// Prevent model overwrite in dev
const Subscriber =
  mongoose.models.Subscribers || mongoose.model("Subscribers", subscriberSchema);

export default Subscriber;
