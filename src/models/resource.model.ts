import mongoose, { Schema, Document } from "mongoose";

// Assuming you have an Admin model to link to the creator of the resource
export interface IResource extends Document {
  title: string;
  description: string;
  type: "video" | "document" | "image" | "audio"; 
  fileUrl: string;
  createdAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["video", "document", "image", "audio"],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent overwrite during dev/watch mode
const Resource = mongoose.models.Resource || mongoose.model<IResource>("Resource", resourceSchema);

export default Resource;
