// import mongoose from "mongoose";

// const { Schema } = mongoose;

// const membershipSchema = new Schema(
//   {
//     userId: {
//       type: String,
//     },
//     stripeCustomerId: {
//       type: String,
//     },
//     plan: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Membership = mongoose.models.Memberships || mongoose.model("Memberships", membershipSchema);
// export default Membership;


import mongoose from "mongoose";

const { Schema } = mongoose;

const membershipSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    paystackCustomerId: {
      type: String,
   
    },
    paystackSubscriptionId: {
      type: String,
    },
    plan: {
      type: String,
      enum: ["FREE", "LUNCH", "SCALE"],
      default: "FREE",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "past_due", "cancelled"],
      default: "inactive",
    },
    currentPeriodEnd: Date,
    email: String,
  },
  { timestamps: true }
);


// Manually create index AFTER ensuring collection exists
membershipSchema.index({ userId: 1 }, { unique: true });
membershipSchema.index({ paystackCustomerId: 1 });
membershipSchema.index({ paystackSubscriptionId: 1 });

const Membership =
  mongoose.models.Membership || mongoose.model("Membership", membershipSchema);

export default Membership;
