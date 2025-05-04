import mongoose from "mongoose";

const { Schema } = mongoose;

const subscriberShema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    newsLetterOwnerId: {
      type: String,
    },
    source: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscriber =
  mongoose.models.Subscribers || mongoose.model("Subscribers", subscriberShema);

export default Subscriber;
