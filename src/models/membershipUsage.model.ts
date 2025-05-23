import mongoose, { Schema, Document } from "mongoose";

export interface IMembershipUsage extends Document {
  userId: string;
  month: string; // e.g., "2025-05"
  emailsSent: number;
  subscribersAdded: number;
  campaignsCreated: number; 
  categoriesCreated: number;
}

const membershipUsageSchema = new Schema<IMembershipUsage>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    month: {
      type: String,
      required: true,
      index: true,
    },
    emailsSent: {
      type: Number,
      default: 0,
    },
    subscribersAdded: {
      type: Number,
      default: 0,
    },
    campaignsCreated: {
      type: Number,
      default: 0, 
    },
    categoriesCreated: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

// Prevent overwrite during dev/watch mode
const MembershipUsage =
  mongoose.models.MembershipUsage ||
  mongoose.model<IMembershipUsage>("MembershipUsage", membershipUsageSchema);

export default MembershipUsage;
