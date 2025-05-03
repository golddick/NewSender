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
  subscriptionStatus: "active" | "inactive" | "past_due" | "cancelled";
  currentPeriodEnd?: Date;
  email: string;
  amount?: number;
  currency?: string;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  subscriberLimit?: number;
  emailLimit?: number;
}

const membershipSchema = new Schema<IMembership>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    paystackCustomerId: {
      type: String,
      index: true
    },
    paystackSubscriptionId: {
      type: String,
      index: true
    },
    plan: {
      type: String,
      enum: ["FREE", "LUNCH", "SCALE"],
      default: "FREE"
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive", "past_due", "cancelled"],
      default: "inactive"
    },
    currentPeriodEnd: Date,
    email: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "NGN"
    },
    lastPaymentDate: Date,
    nextPaymentDate: Date,

    // New fields
    subscriberLimit: {
      type: Number,
      default: 500 // FREE plan default
    },
    emailLimit: {
      type: Number,
      default: 2 // FREE plan default (monthly?)
    }
  },
  { timestamps: true }
);

// Prevent overwrite during dev/watch mode
const Membership =
  mongoose.models.Membership ||
  mongoose.model<IMembership>("Membership", membershipSchema);

export default Membership;





// import mongoose, { Schema, Document } from "mongoose";

// interface IMembership extends Document {
//   userId: string;
//   paystackCustomerId?: string;
//   paystackSubscriptionId?: string;
//   plan: "FREE" | "LUNCH" | "SCALE";
//   subscriptionStatus: "active" | "inactive" | "past_due" | "cancelled";
//   currentPeriodEnd?: Date;
//   email: string;
//   amount?: number; 
//   currency?: string;
//   lastPaymentDate?: Date;
//   nextPaymentDate?: Date;
// }

// const membershipSchema = new Schema<IMembership>(
//   {
//     userId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true // Define index here
//     },
//     paystackCustomerId: {
//       type: String,
//       index: true // Define index here
//     },
//     paystackSubscriptionId: {
//       type: String,
//       index: true // Define index here
//     },
//     plan: {
//       type: String,
//       enum: ["FREE", "LUNCH", "SCALE"],
//       default: "FREE"
//     },
//     subscriptionStatus: {
//       type: String,
//       enum: ["active", "inactive", "past_due", "cancelled"],
//       default: "inactive"
//     },
//     currentPeriodEnd: Date,
//     email: {
//       type: String,
//       required: true
//     },
//     amount: {
//       type: Number,
//       default: 0 // 0 for FREE plan
//     },
//     currency: {
//       type: String,
//       default: "NGN" // Nigerian Naira as default
//     },
//     lastPaymentDate: Date,
//     nextPaymentDate: Date
//   },
//   { timestamps: true }
// );

// // Remove manual index creation to prevent duplicates
// const Membership =
//   mongoose.models.Membership || 
//   mongoose.model<IMembership>("Membership", membershipSchema);

// export default Membership;




