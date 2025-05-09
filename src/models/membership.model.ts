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





import mongoose, { Schema, Document } from "mongoose";

export interface IMembership extends Document {
  userId: string;
  paystackCustomerId?: string;
  paystackSubscriptionId?: string;
  plan: "FREE" | "LUNCH" | "SCALE";
  role: "USER" | "NEWSLETTEROWNER" | "THENEWS"; 
  subscriptionStatus: "active" | "inactive" | "past_due" | "cancelled";
  currentPeriodEnd?: Date;
  email: string;
  organization: string;
  amount?: number;
  currency?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  subscriberLimit?: number;
  emailLimit?: number;
  campaignLimit?: number; 
  categoryLimit?: number;
}

const membershipSchema = new Schema<IMembership>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paystackCustomerId: {
      type: String,
      index: true,
    },
    paystackSubscriptionId: {
      type: String,
      index: true,
    },
    plan: {
      type: String,
      enum: ["FREE", "LUNCH", "SCALE"],
      default: "FREE",
    },
    role: {
      type: String,
      enum: ["USER", "NEWSLETTEROWNER", "THENEWS"],
      default: "USER",
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "past_due", "cancelled"],
      default: "inactive",
    },
    currentPeriodEnd: Date,
    email: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: false,
    },
    amount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    lastPaymentDate: Date,
    nextPaymentDate: Date,
    subscriberLimit: {
      type: Number,
      default: 500,
    },
    categoryLimit: {
      type: Number,
      default: 1,
    },
    emailLimit: {
      type: Number,
      default: 2,
    },
    campaignLimit: {
      type: Number,
      default: 1, // Default for 'Free' plan
    },
  },
  { timestamps: true }
);

// Prevent overwrite during dev/watch mode
const Membership =
  mongoose.models.Membership || mongoose.model<IMembership>("Membership", membershipSchema);

export default Membership;
